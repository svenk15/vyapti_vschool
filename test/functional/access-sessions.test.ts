import {afterAll,expect,it} from 'vitest';
import {randomBytes,randomUUID} from 'node:crypto';
import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {createAccessServices} from '../../backend/composition/access';

const url=process.env.TEST_DATABASE_URL??'';if(new URL(url).pathname!=='/vyapti_vschool_test')throw new Error('Dedicated test DB required');
const db=new PrismaClient({adapter:new PrismaPg({connectionString:url}),log:[]});let clock=new Date('2026-10-16T08:00:00Z');const service=createAccessServices({databaseUrl:url,now:()=>clock}),operator={operatorId:randomUUID(),verified:true as const};
function fixture(){const suffix=randomUUID();return {organizationName:`Session institution ${suffix}`,schoolName:`Session school ${suffix}`,schoolCode:'MAIN',timezone:'Asia/Kolkata',adminEmail:`session-${suffix}@vschool.example`,password:randomBytes(24).toString('base64url')};}
afterAll(async()=>{await service.disconnect();await db.$disconnect();});

it('persists only own safe sessions and selectively revokes exactly once under concurrent retry',async()=>{
 const first=fixture(),second=fixture(),firstIds=await service.provisionSchool(first,operator),secondIds=await service.provisionSchool(second,operator),identity=(await service.authenticate(first.adminEmail,first.password))!,foreignIdentity=(await service.authenticate(second.adminEmail,second.password))!,expires=new Date(clock.getTime()+8*60*60*1000);
 const current=await service.startSession(identity,'DESKTOP_WEB',expires),other=await service.startSession(identity,'MOBILE_WEB',expires),foreign=await service.startSession(foreignIdentity,'DESKTOP_WEB',expires);
 const directory=await service.listSessions(identity,current.sessionId);expect(directory.sessions).toHaveLength(2);expect(directory.sessions[0]).toMatchObject({id:current.sessionId,current:true,label:'DESKTOP_WEB'});expect(JSON.stringify(directory)).not.toContain(first.adminEmail);expect(JSON.stringify(directory)).not.toMatch(/user-agent|ipAddress|password/i);
 await expect(service.revokeSession(identity,current.sessionId,foreign.sessionId)).rejects.toThrow('NOT_FOUND');expect(await db.accountSession.findUnique({where:{id:foreign.sessionId}})).toMatchObject({revokedAt:null,accountId:secondIds.accountId});
 const raced=await Promise.all([service.revokeSession(identity,current.sessionId,other.sessionId),service.revokeSession(identity,current.sessionId,other.sessionId)]);expect(raced.filter(value=>value.replayed)).toHaveLength(1);expect(raced.filter(value=>!value.replayed)).toHaveLength(1);expect(await db.authSecurityEvent.count({where:{accountId:firstIds.accountId,kind:'SESSION_REVOKED'}})).toBe(1);expect(await service.isCurrentSession(identity,other.sessionId)).toBe(false);expect(await service.isCurrentSession(identity,current.sessionId)).toBe(true);
 const replay=await service.revokeSession(identity,current.sessionId,other.sessionId);expect(replay.replayed).toBe(true);expect(await db.authSecurityEvent.count({where:{accountId:firstIds.accountId,kind:'SESSION_REVOKED'}})).toBe(1);
 const raw=await db.accountSession.findUniqueOrThrow({where:{id:current.sessionId}});expect(raw.safeLabel).toBe('DESKTOP_WEB');expect(Object.keys(raw)).not.toContain('userAgent');
});

it('treats expiry and account-wide token-version change as authoritative',async()=>{
 const input=fixture(),ids=await service.provisionSchool(input,operator),identity=(await service.authenticate(input.adminEmail,input.password))!,expires=new Date(clock.getTime()+60_000),session=await service.startSession(identity,'DESKTOP_WEB',expires);expect(await service.isCurrentSession(identity,session.sessionId)).toBe(true);clock=new Date(expires.getTime()+1);expect(await service.isCurrentSession(identity,session.sessionId)).toBe(false);clock=new Date('2026-10-16T09:00:00Z');const active=await service.startSession(identity,'MOBILE_WEB',new Date(clock.getTime()+60_000));await db.userAccount.update({where:{id:ids.accountId},data:{tokenVersion:{increment:1},version:{increment:1}}});expect(await service.isCurrentSession(identity,active.sessionId)).toBe(false);await expect(service.listSessions(identity,active.sessionId)).rejects.toThrow('UNAUTHENTICATED');
});
