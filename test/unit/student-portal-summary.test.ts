import {describe,expect,it} from "vitest";
import {selectCurrentStudentPortalAccess,type StudentPortalAccessRecord} from "../../shared/contracts/student-portal";

function access(overrides:Partial<StudentPortalAccessRecord>):StudentPortalAccessRecord{
 return {accessId:"00000000-0000-4000-8000-000000000001",studentId:"student",studentName:"Asha Example",email:"asha@example.test",status:"INVITE_SENT",version:1,authorizedAt:"2026-10-01T00:00:00.000Z",acceptedAt:null,revokedAt:null,invitationId:"invite",deliveryFailureReason:null,purposes:["profile.read_self"],...overrides};
}

describe("Student portal profile summary",()=>{
 it("selects the current active access instead of relying on array order",()=>{
  const removed=access({accessId:"removed",status:"ACCESS_REMOVED",authorizedAt:"2026-10-20T00:00:00.000Z",revokedAt:"2026-10-20T00:00:00.000Z"});
  const enabled=access({accessId:"enabled",status:"ACCESS_ENABLED",authorizedAt:"2026-10-10T00:00:00.000Z",acceptedAt:"2026-10-11T00:00:00.000Z"});
  expect(selectCurrentStudentPortalAccess([removed,enabled])).toEqual(enabled);
 });

 it("uses the latest historical removal when no active access exists",()=>{
  const older=access({accessId:"older",status:"ACCESS_REMOVED",authorizedAt:"2026-10-01T00:00:00.000Z",revokedAt:"2026-10-02T00:00:00.000Z"});
  const latest=access({accessId:"latest",status:"ACCESS_REMOVED",authorizedAt:"2026-10-12T00:00:00.000Z",revokedAt:"2026-10-13T00:00:00.000Z"});
  expect(selectCurrentStudentPortalAccess([older,latest])).toEqual(latest);
  expect(selectCurrentStudentPortalAccess([])).toBeNull();
 });
});
