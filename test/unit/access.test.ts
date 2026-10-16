import { describe,it,expect,vi } from "vitest";
import { capabilitiesFor,currentIdentity,nextFailure,normalizeProvision,validPassword } from "../../backend/modules/access/domain/policy";
import { createAccessUseCases,type AccessRepository } from "../../backend/modules/access/application/services";
const id="7bc18932-d5bb-4c12-841f-832a04a7ab76";
const input={organizationName:"  Synthetic institution ",schoolName:" School ",schoolCode:" MAIN ",timezone:"Asia/Kolkata",adminEmail:"  Admin@VSCHOOL.EXAMPLE ",password:"unit-only-password"};
describe("IAM-01 policies",()=>{
 it("normalizes operator fields and rejects invalid timezones",()=>{expect(normalizeProvision(input)).toMatchObject({organizationName:"Synthetic institution",schoolCode:"MAIN",adminEmail:"admin@vschool.example"});expect(()=>normalizeProvision({...input,timezone:"Invalid/Zone"})).toThrow("VALIDATION");});
 it("enforces bcrypt UTF-8 byte limits",()=>{expect(validPassword("a".repeat(72))).toBe(true);expect(validPassword("a".repeat(73))).toBe(false);expect(validPassword("😀".repeat(19))).toBe(false);expect(validPassword("short")).toBe(false);});
 it("unions roles independently of order without granting admin attendance marking",()=>{expect(capabilitiesFor(["SCHOOL_ADMIN"])).not.toContain("attendance.mark");expect(new Set(capabilitiesFor(["TEACHER","SCHOOL_ADMIN"]))).toEqual(new Set(capabilitiesFor(["SCHOOL_ADMIN","TEACHER"])));expect(capabilitiesFor(["TEACHER"])).not.toContain("school.manage");});
 it("keeps Principal authority explicit and narrow",()=>{expect(capabilitiesFor(["SCHOOL_ADMIN"])).not.toContain("leadership.read");expect(capabilitiesFor(["TEACHER"])).not.toContain("leadership.read");expect(capabilitiesFor(["PRINCIPAL"])).toEqual(["leadership.read","attendance.read_leadership","timetable.read_leadership","learning.read_leadership","communication.read_leadership","self.read"]);expect(capabilitiesFor(["PRINCIPAL"])).not.toContain("school.manage");expect(capabilitiesFor(["PRINCIPAL"])).not.toContain("timetable.manage");expect(capabilitiesFor(["PRINCIPAL"])).not.toContain("attendance.read_school");expect(capabilitiesFor(["PRINCIPAL"])).not.toContain("communication.publish");expect(capabilitiesFor(["PRINCIPAL"])).not.toContain("learning.assignment.write");expect(capabilitiesFor(["PRINCIPAL"])).not.toContain("learning.feedback.write");});
 it("rejects disabled and stale identities",()=>{expect(currentIdentity({status:"DISABLED",tokenVersion:1},1)).toBe(false);expect(currentIdentity({status:"ACTIVE",tokenVersion:2},1)).toBe(false);expect(currentIdentity(null,1)).toBe(false);});
 it("returns only the current account's safe self fields",async()=>{const account=vi.fn().mockResolvedValue({status:'ACTIVE',tokenVersion:1,normalizedEmail:'teacher@example.test',createdAt:new Date('2026-01-02T03:04:05Z')}),service=createAccessUseCases({account} as unknown as AccessRepository,{hash:vi.fn(),verify:vi.fn()},()=>id);await expect(service.getSelfAccount({accountId:id,tokenVersion:1})).resolves.toEqual({accountId:id,email:'teacher@example.test',status:'ACTIVE',createdAt:'2026-01-02T03:04:05.000Z'});expect(account).toHaveBeenCalledWith({accountId:id,tokenVersion:1});});
 it("locks on fifth failure and starts a new cycle after expiry",()=>{const now=new Date(0);expect(nextFailure(4,null,now)).toEqual({failedAttempts:5,lockedUntil:new Date(900000)});expect(nextFailure(5,new Date(0),new Date(1))).toEqual({failedAttempts:1,lockedUntil:null});});
 it("checks operator and current account before persistence or scope reads",async()=>{
  const repository={account:vi.fn().mockResolvedValue({status:"ACTIVE",tokenVersion:2}),adminContext:vi.fn(),provision:vi.fn()} as unknown as AccessRepository;
  const hash=vi.fn(),service=createAccessUseCases(repository,{hash,verify:vi.fn()},()=>id);
  await expect(service.provisionSchool(input,{operatorId:id,verified:false as true})).rejects.toThrow("VALIDATION");expect(hash).not.toHaveBeenCalled();
  await expect(service.getAdminHome({accountId:id,tokenVersion:1})).rejects.toThrow("UNAUTHENTICATED");expect(repository.adminContext).not.toHaveBeenCalled();
 });
 it("hashes outside provision and passes no plaintext password into repository",async()=>{
  const provision=vi.fn().mockResolvedValue({schoolId:id});const service=createAccessUseCases({provision} as unknown as AccessRepository,{hash:async()=>"hash",verify:vi.fn()},()=>id);
  await service.provisionSchool(input,{operatorId:id,verified:true});expect(provision.mock.calls[0][0]).not.toHaveProperty("password");expect(provision.mock.calls[0][1]).toBe("hash");
 });
 it("redacts storage errors before the credential provider can expose them",async()=>{
  const repository={loginRecord:vi.fn().mockRejectedValue(new Error("private adapter diagnostics"))} as unknown as AccessRepository;
  const service=createAccessUseCases(repository,{hash:vi.fn(),verify:vi.fn()},()=>id);
  await expect(service.authenticate(input.adminEmail,input.password)).rejects.toThrow(/^UNAVAILABLE$/);
 });
});
