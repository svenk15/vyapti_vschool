import "server-only";
import {randomUUID} from "node:crypto";
import {AccessError} from "../../backend/modules/access/contracts";
import {GuardianError} from "../../backend/modules/guardians/contracts";
import {StudentRegistrationValidationError} from "../../backend/modules/students/domain/student";
import {StudentOnboardingError} from "../../backend/modules/students/application/onboarding";
import type {StudentOnboardingCommand} from "../../shared/contracts/students";
import {getIdentity} from "./auth";
import {studentOnboardingGateway} from "./student-onboarding";

const headers={"Cache-Control":"private, no-store"};
const messages:Record<string,string>={
  UNAUTHENTICATED:"Sign in to continue.",FORBIDDEN:"Your current school permission does not allow this action.",NOT_FOUND:"The selected school record is unavailable in this branch.",
  VALIDATION:"Check the highlighted student, placement and parent or guardian details.",CONFLICT:"The requested registration, placement or family access conflicts with a current record.",
  STALE_VERSION:"School data changed. Refresh and review the remaining step.",IDEMPOTENCY_CONFLICT:"A saved request key was already used for different details.",
  RELEASE_UNAVAILABLE:"One of the selected onboarding steps is unavailable in this release.",MODULE_NOT_LICENSED:"One of the selected onboarding steps is not licensed for this institution.",
  MODULE_DISABLED:"One of the selected onboarding steps is not active for this branch.",UNAVAILABLE:"Student onboarding is temporarily unavailable. Retry the unchanged request.",
};

function status(code:string){return code==="UNAUTHENTICATED"?401:code==="FORBIDDEN"?403:code==="NOT_FOUND"?404:code==="VALIDATION"?422:["UNAVAILABLE","RELEASE_UNAVAILABLE"].includes(code)?503:409;}
function errorResponse(error:unknown){
  const onboarding=error instanceof StudentOnboardingError?error:null,owner=onboarding?.ownerCause??error;
  const code=onboarding?.ownerCode??(owner instanceof AccessError||owner instanceof GuardianError?owner.code:"UNAVAILABLE"),httpStatus=status(code);
  const fieldErrors=owner instanceof StudentRegistrationValidationError?{[owner.field]:messages.VALIDATION}:undefined;
  return Response.json({code,message:messages[code]??"Unable to complete student onboarding.",requestId:randomUUID(),retryable:httpStatus===503,...(onboarding?{stage:onboarding.stage,partial:onboarding.partial}:{}),...(fieldErrors?{fieldErrors}:{})},{status:httpStatus,headers});
}

async function body(request:Request):Promise<StudentOnboardingCommand>{
  if(!process.env.NEXTAUTH_URL||request.headers.get("origin")!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError("FORBIDDEN");
  const reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;
  if(reader)for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>8192){void reader.cancel();throw new AccessError("VALIDATION");}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  try{
    const value=JSON.parse(new TextDecoder().decode(bytes)) as StudentOnboardingCommand;
    if(!value||typeof value!=="object"||Array.isArray(value)||!value.registration||request.headers.get("idempotency-key")!==value.registration.key)throw new AccessError("VALIDATION");
    return value;
  }catch(error){if(error instanceof AccessError)throw error;throw new AccessError("VALIDATION");}
}

export async function createStudentOnboarding(request:Request){
  try{
    const identity=await getIdentity();if(!identity)throw new AccessError("UNAUTHENTICATED");
    const result=await studentOnboardingGateway.execute(identity,await body(request));
    const replayed=result.student.replayed&&(result.enrollment?.replayed??true)&&(result.guardian?.replayed??true);
    return Response.json(result,{status:replayed?200:201,headers});
  }catch(error){return errorResponse(error);}
}
