import {describe,expect,it,vi} from 'vitest';
import {setVerifiedAccountDatabaseContext,setVerifiedBranchDatabaseContext} from '../../backend/modules/tenancy/infrastructure/verified-db-context';

describe('verified branch database context',()=>{
 it('sets account and scope only through transaction-local settings',async()=>{
  const query=vi.fn().mockResolvedValue([]),tx={$queryRaw:query};
  await setVerifiedBranchDatabaseContext(tx as never,{accountId:'11111111-1111-4111-8111-111111111111',organizationId:'22222222-2222-4222-8222-222222222222',branchId:'33333333-3333-4333-8333-333333333333'},1);
  expect(query).toHaveBeenCalledOnce();
  const [statement,...values]=query.mock.calls[0];
  expect(String(statement.join('?'))).toContain('vs_set_verified_branch_context(?::uuid,?,?::uuid,?::uuid)');
  expect(values).toEqual(['11111111-1111-4111-8111-111111111111',1,'22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333']);
 });
 it('rejects malformed scope before issuing SQL',async()=>{
  const query=vi.fn(),tx={$queryRaw:query};
  await expect(setVerifiedBranchDatabaseContext(tx as never,{accountId:'not-an-id',organizationId:'22222222-2222-4222-8222-222222222222',branchId:'33333333-3333-4333-8333-333333333333'},1)).rejects.toThrow('Invalid verified tenant database context');
  expect(query).not.toHaveBeenCalled();
 });
 it('validates account identity before its account-only context helper',async()=>{
  const query=vi.fn().mockResolvedValue([{verified:true}]),tx={$queryRaw:query};
  await expect(setVerifiedAccountDatabaseContext(tx as never,'invalid',1)).rejects.toThrow('Invalid verified account database context');
  expect(query).not.toHaveBeenCalled();
  expect(await setVerifiedAccountDatabaseContext(tx as never,'11111111-1111-4111-8111-111111111111',0)).toBe(true);
  expect(String(query.mock.calls[0]?.[0].join('?'))).toContain('vs_set_verified_account_context(?::uuid,?)');
 });
});
