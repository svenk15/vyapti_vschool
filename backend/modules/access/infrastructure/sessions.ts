import {randomUUID} from 'node:crypto';
import type {PrismaClient} from '../../../../generated/prisma/client';
import type {Identity} from '../../../../shared/contracts/access';
import type {AccountSessionRepository, StoredAccountSession} from '../application/sessions';
import {AccessError} from '../domain/policy';
import type {VerifiedDatabaseContextPort} from '../../tenancy/contracts/verified-database-context';

const select = {id: true, accountId: true, tokenVersion: true, safeLabel: true, startedAt: true, expiresAt: true, revokedAt: true, version: true} as const;
type SessionRow = {id: string; accountId: string; tokenVersion: number; safeLabel: string; startedAt: Date; expiresAt: Date; revokedAt: Date | null; version: number};
function stored(value: SessionRow | null): StoredAccountSession {
  if (!value || (value.safeLabel !== 'DESKTOP_WEB' && value.safeLabel !== 'MOBILE_WEB')) throw new AccessError('UNAVAILABLE');
  return {...value, safeLabel: value.safeLabel};
}

export class PrismaAccountSessionRepository implements AccountSessionRepository {
  constructor(private readonly db: PrismaClient, private readonly context: VerifiedDatabaseContextPort) {}
  account(identity: Identity) {
    return this.db.$transaction(async tx => {
      if (!await this.context.establishAccount(tx, identity.accountId, identity.tokenVersion)) return null;
      return tx.userAccount.findUnique({where: {id: identity.accountId}, select: {status: true, tokenVersion: true}});
    }, {isolationLevel: 'RepeatableRead'});
  }
  async create(identity: Identity, input: {id: string; label: 'DESKTOP_WEB' | 'MOBILE_WEB'; startedAt: Date; expiresAt: Date; requestId: string}) {
    try {
      return await this.db.$transaction(async tx => {
        if (!await this.context.establishAccount(tx, identity.accountId, identity.tokenVersion)) throw new AccessError('UNAUTHENTICATED');
        await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${identity.accountId}::uuid FOR UPDATE`;
        const account = await tx.userAccount.findUnique({where: {id: identity.accountId}, select: {status: true, tokenVersion: true}});
        if (!account || account.status !== 'ACTIVE' || account.tokenVersion !== identity.tokenVersion) throw new AccessError('UNAUTHENTICATED');
        const session = await tx.accountSession.create({data: {id: input.id, accountId: identity.accountId, tokenVersion: identity.tokenVersion, safeLabel: input.label, startedAt: input.startedAt, expiresAt: input.expiresAt, version: 1}, select});
        await tx.authSecurityEvent.create({data: {id: randomUUID(), accountId: identity.accountId, actorAccountId: identity.accountId, kind: 'SESSION_STARTED', occurredAt: input.startedAt, requestId: input.requestId, decision: 'ALLOWED', safeReason: input.label}});
        return stored(session);
      });
    } catch (error) {
      if (error instanceof AccessError) throw error;
      throw new AccessError('UNAVAILABLE');
    }
  }
  async read(identity: Identity, sessionId: string) {
    return this.db.$transaction(async tx => {
      if (!await this.context.establishAccount(tx, identity.accountId, identity.tokenVersion)) return null;
      return tx.accountSession.findFirst({where: {id: sessionId, accountId: identity.accountId}, select});
    }, {isolationLevel: 'RepeatableRead'});
  }
  async find(identity: Identity, sessionId: string) {
    const value = await this.read(identity, sessionId);
    return value ? stored(value) : null;
  }
  async list(identity: Identity, now: Date) {
    return this.db.$transaction(async tx => {
      if (!await this.context.establishAccount(tx, identity.accountId, identity.tokenVersion)) throw new AccessError('UNAUTHENTICATED');
      const rows = await tx.accountSession.findMany({where: {accountId: identity.accountId, tokenVersion: identity.tokenVersion, revokedAt: null, expiresAt: {gt: now}}, orderBy: [{startedAt: 'desc'}, {id: 'asc'}], take: 20, select});
      return rows.map(stored);
    }, {isolationLevel: 'RepeatableRead'});
  }
  async revoke(identity: Identity, sessionId: string, occurredAt: Date, requestId: string) {
    try {
      return await this.db.$transaction(async tx => {
        if (!await this.context.establishAccount(tx, identity.accountId, identity.tokenVersion)) throw new AccessError('UNAUTHENTICATED');
        await tx.$queryRaw`SELECT id FROM vs_access_user_account WHERE id=${identity.accountId}::uuid FOR UPDATE`;
        const rows = await tx.$queryRaw<Array<{id: string}>>`SELECT id FROM vs_access_account_session WHERE account_id=${identity.accountId}::uuid AND id=${sessionId}::uuid FOR UPDATE`;
        if (!rows[0]) throw new AccessError('NOT_FOUND');
        const existing = await tx.accountSession.findUnique({where: {id: sessionId}, select});
        if (!existing || existing.accountId !== identity.accountId || existing.tokenVersion !== identity.tokenVersion) throw new AccessError('NOT_FOUND');
        if (existing.revokedAt) return {...stored(existing), replayed: true};
        const updated = await tx.accountSession.update({where: {id: sessionId}, data: {revokedAt: occurredAt, version: {increment: 1}}, select});
        await tx.authSecurityEvent.create({data: {id: randomUUID(), accountId: identity.accountId, actorAccountId: identity.accountId, kind: 'SESSION_REVOKED', occurredAt, requestId, decision: 'ALLOWED', safeReason: 'SELF_SERVICE'}});
        return {...stored(updated), replayed: false};
      });
    } catch (error) {
      if (error instanceof AccessError) throw error;
      throw new AccessError('UNAVAILABLE');
    }
  }
}
