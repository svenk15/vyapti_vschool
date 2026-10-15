import type {
  AccountSessionDirectory,
  AccountSessionLabel,
  AccountSessionRevocation,
  Identity,
} from '../../../../shared/contracts/access';
import {AccessError, currentIdentity, uuidPattern} from '../domain/policy';

export type StoredAccountSession = Readonly<{
  id: string;
  accountId: string;
  tokenVersion: number;
  safeLabel: AccountSessionLabel;
  startedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  version: number;
}>;

export interface AccountSessionRepository {
  account(identity: Identity): Promise<{status: string; tokenVersion: number} | null>;
  create(identity: Identity, input: {id: string; label: AccountSessionLabel; startedAt: Date; expiresAt: Date; requestId: string}): Promise<StoredAccountSession>;
  list(identity: Identity, now: Date): Promise<readonly StoredAccountSession[]>;
  find(identity: Identity, sessionId: string): Promise<StoredAccountSession | null>;
  revoke(identity: Identity, sessionId: string, occurredAt: Date, requestId: string): Promise<StoredAccountSession & {replayed: boolean}>;
}

export interface AccountSessionFacade {
  startSession(identity: Identity, label: AccountSessionLabel, expiresAt: Date): Promise<{sessionId: string}>;
  isCurrentSession(identity: Identity, sessionId: string): Promise<boolean>;
  listSessions(identity: Identity | null, currentSessionId: string): Promise<AccountSessionDirectory>;
  revokeSession(identity: Identity | null, currentSessionId: string, targetSessionId: string): Promise<AccountSessionRevocation>;
}

function validIdentity(identity: Identity | null): identity is Identity {
  return !!identity && uuidPattern.test(identity.accountId) && Number.isInteger(identity.tokenVersion) && identity.tokenVersion > 0;
}

export function createAccountSessionUseCases(
  repository: AccountSessionRepository,
  newId: () => string,
  now: () => Date = () => new Date(),
): AccountSessionFacade {
  async function authorize(identity: Identity | null) {
    if (!validIdentity(identity) || !currentIdentity(await repository.account(identity), identity.tokenVersion)) {
      throw new AccessError('UNAUTHENTICATED');
    }
    return identity;
  }
  async function isCurrent(identity: Identity, sessionId: string) {
    if (!validIdentity(identity) || !uuidPattern.test(sessionId)) return false;
    const [account, session] = await Promise.all([repository.account(identity), repository.find(identity, sessionId)]);
    const instant = now();
    return currentIdentity(account, identity.tokenVersion)
      && !!session
      && session.accountId === identity.accountId
      && session.tokenVersion === identity.tokenVersion
      && !session.revokedAt
      && session.startedAt <= instant
      && session.expiresAt > instant;
  }
  return {
    async startSession(identity, label, expiresAt) {
      const actor = await authorize(identity), startedAt = now();
      if (!['DESKTOP_WEB', 'MOBILE_WEB'].includes(label) || !(expiresAt instanceof Date) || !Number.isFinite(expiresAt.getTime()) || expiresAt <= startedAt) {
        throw new AccessError('VALIDATION');
      }
      const session = await repository.create(actor, {id: newId(), label, startedAt, expiresAt, requestId: newId()});
      return {sessionId: session.id};
    },
    async isCurrentSession(identity, sessionId) {
      return isCurrent(identity, sessionId);
    },
    async listSessions(identity, currentSessionId) {
      const actor = await authorize(identity);
      if (!uuidPattern.test(currentSessionId) || !await isCurrent(actor, currentSessionId)) throw new AccessError('UNAUTHENTICATED');
      const sessions = await repository.list(actor, now());
      return {sessions: sessions.map(session => ({
        id: session.id,
        label: session.safeLabel,
        startedAt: session.startedAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        current: session.id === currentSessionId,
        version: session.version,
      })).sort((left, right) => Number(right.current) - Number(left.current) || right.startedAt.localeCompare(left.startedAt) || left.id.localeCompare(right.id))};
    },
    async revokeSession(identity, currentSessionId, targetSessionId) {
      const actor = await authorize(identity);
      if (!uuidPattern.test(currentSessionId) || !uuidPattern.test(targetSessionId) || !await isCurrent(actor, currentSessionId)) throw new AccessError('UNAUTHENTICATED');
      const revoked = await repository.revoke(actor, targetSessionId, now(), newId());
      return {sessionId: revoked.id, revokedAt: revoked.revokedAt!.toISOString(), version: revoked.version, replayed: revoked.replayed, current: revoked.id === currentSessionId};
    },
  };
}
