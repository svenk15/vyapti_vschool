import {expect,it,vi} from 'vitest';
import {createAccountPreferenceUseCases,type AccountPreferenceRepository} from '../../backend/modules/access/application/preferences';
import {normalizePreferenceUpdate} from '../../backend/modules/access/domain/preferences';

const identity={accountId:'7bc18932-d5bb-4c12-841f-832a04a7ab76',tokenVersion:2};
const bundle={density:'COMFORTABLE' as const,reducedMotion:'SYSTEM' as const,versions:{density:0,reducedMotion:0},updatedAt:null};

it('accepts only the two approved own-account preference keys and non-negative expected versions',()=>{
 expect(normalizePreferenceUpdate({density:'COMPACT',reducedMotion:'REDUCE',expectedVersions:{density:0,reducedMotion:4}})).toEqual({density:'COMPACT',reducedMotion:'REDUCE',expectedVersions:{density:0,reducedMotion:4}});
 expect(()=>normalizePreferenceUpdate({density:'SPACIOUS',reducedMotion:'REDUCE',expectedVersions:{density:0,reducedMotion:0}})).toThrow('VALIDATION');
 expect(()=>normalizePreferenceUpdate({density:'COMPACT',reducedMotion:'NONE',expectedVersions:{density:0,reducedMotion:0}})).toThrow('VALIDATION');
 expect(()=>normalizePreferenceUpdate({density:'COMPACT',reducedMotion:'REDUCE',expectedVersions:{density:-1,reducedMotion:0},accountId:'another'})).toThrow('VALIDATION');
});

it('derives preference ownership from the authenticated identity and validates stable intent keys',async()=>{
 const repository:AccountPreferenceRepository={read:vi.fn().mockResolvedValue(bundle),update:vi.fn().mockResolvedValue({...bundle,replayed:false}),support:vi.fn().mockResolvedValue(null)},service=createAccountPreferenceUseCases(repository);
 await service.updateOwnPreferences(identity,{density:'COMFORTABLE',reducedMotion:'SYSTEM',expectedVersions:{density:0,reducedMotion:0}},'0123456789abcdef');
 expect(repository.update).toHaveBeenCalledWith(identity,expect.objectContaining({density:'COMFORTABLE'}),'0123456789abcdef');
 expect(()=>service.updateOwnPreferences(identity,{density:'COMFORTABLE',reducedMotion:'SYSTEM',expectedVersions:{density:0,reducedMotion:0}},'short')).toThrow('VALIDATION');
 expect(()=>service.getOwnPreferences(null)).toThrow('UNAUTHENTICATED');
});
