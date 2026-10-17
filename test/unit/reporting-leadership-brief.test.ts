import {randomUUID} from 'node:crypto';
import {describe,expect,it,vi} from 'vitest';
import {createLeadershipBriefUseCases,type LeadershipBriefRepository} from '../../backend/modules/reporting/application/leadership-brief';

describe('leadership brief application contract',()=>{
 it('normalizes a bounded draft before delegating to the repository',async()=>{
  const repository={create:vi.fn().mockResolvedValue({briefId:randomUUID(),revisionNumber:1,state:'DRAFT',version:1,replayed:false})} as unknown as LeadershipBriefRepository;
  const facade=createLeadershipBriefUseCases(repository),identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID(),snapshotId=randomUUID(),recipientId=randomUUID(),key=randomUUID();
  await facade.createBrief(identity,organizationId,schoolId,{title:'  Weekly review  ',purpose:'  Governing body review  ',interpretation:'  Coverage is improving.  ',nextActions:'  Review the remaining register.  ',snapshotIds:[snapshotId],recipientAccountIds:[recipientId],key});
  expect(repository.create).toHaveBeenCalledWith(identity,{organizationId,schoolId},{title:'Weekly review',purpose:'Governing body review',interpretation:'Coverage is improving.',nextActions:'Review the remaining register.',snapshotIds:[snapshotId],recipientAccountIds:[recipientId],key});
 });

 it('rejects duplicate sources, empty recipients and invalid expected versions before persistence',()=>{
  const repository={create:vi.fn(),finalize:vi.fn()} as unknown as LeadershipBriefRepository,facade=createLeadershipBriefUseCases(repository),identity={accountId:randomUUID(),tokenVersion:1},organizationId=randomUUID(),schoolId=randomUUID(),snapshotId=randomUUID();
  expect(()=>facade.createBrief(identity,organizationId,schoolId,{title:'Review',purpose:'Decision',interpretation:'Evidence',snapshotIds:[snapshotId,snapshotId],recipientAccountIds:[randomUUID()],key:randomUUID()})).toThrowError(expect.objectContaining({code:'VALIDATION'}));
  expect(()=>facade.createBrief(identity,organizationId,schoolId,{title:'Review',purpose:'Decision',interpretation:'Evidence',snapshotIds:[snapshotId],recipientAccountIds:[],key:randomUUID()})).toThrowError(expect.objectContaining({code:'VALIDATION'}));
  expect(()=>facade.finalizeBrief(identity,organizationId,schoolId,randomUUID(),{expectedVersion:0,key:randomUUID()})).toThrowError(expect.objectContaining({code:'VALIDATION'}));
  expect(repository.create).not.toHaveBeenCalled();expect(repository.finalize).not.toHaveBeenCalled();
 });
});
