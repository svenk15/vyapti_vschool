import type {Identity} from "../../../../shared/contracts/access";
import type {
  EnrollmentResult,
  StudentOnboardingCommand,
  StudentOnboardingPartial,
  StudentOnboardingResult,
  StudentOnboardingStage,
  StudentProfile,
} from "../../../../shared/contracts/students";
import type {GuardianAuthorizationResult} from "../../../../shared/contracts/guardians";

type Registered=StudentProfile&Readonly<{replayed:boolean}>;
type OwnerFailure=Error&Readonly<{code?:string}>;

export interface StudentOnboardingStudentsPort {
  register(actor:Identity,input:StudentOnboardingCommand["registration"]):Promise<Registered>;
  enroll(actor:Identity,input:NonNullable<StudentOnboardingCommand["placement"]>&Readonly<{studentId:string}>):Promise<EnrollmentResult>;
}

export interface StudentOnboardingGuardiansPort {
  authorize(actor:Identity,studentId:string,input:NonNullable<StudentOnboardingCommand["guardian"]>&Readonly<{requestId:string}>):Promise<GuardianAuthorizationResult>;
}

export class StudentOnboardingError extends Error {
  readonly name="StudentOnboardingError";
  constructor(
    readonly stage:StudentOnboardingStage,
    readonly ownerCode:string,
    readonly partial:StudentOnboardingPartial,
    readonly ownerCause:unknown,
  ){
    super(ownerCause instanceof Error?ownerCause.message:"Student onboarding could not be completed.");
  }
}

function code(error:unknown){return typeof (error as OwnerFailure|undefined)?.code==="string"?(error as OwnerFailure).code!:"UNAVAILABLE";}

export function createStudentOnboardingUseCases(
  students:StudentOnboardingStudentsPort,
  guardians:StudentOnboardingGuardiansPort,
  requestId:()=>string,
){
  return {
    async execute(actor:Identity,input:StudentOnboardingCommand):Promise<StudentOnboardingResult>{
      let student:Registered;
      try{student=await students.register(actor,input.registration);}
      catch(error){throw new StudentOnboardingError("REGISTRATION",code(error),{student:null,enrollment:null},error);}

      let enrollment:EnrollmentResult|null=null;
      if(input.placement){
        try{enrollment=await students.enroll(actor,{...input.placement,studentId:student.studentId});}
        catch(error){throw new StudentOnboardingError("PLACEMENT",code(error),{student,enrollment:null},error);}
      }

      let guardian:GuardianAuthorizationResult|null=null;
      if(input.guardian){
        try{guardian=await guardians.authorize(actor,student.studentId,{...input.guardian,requestId:requestId()});}
        catch(error){throw new StudentOnboardingError("GUARDIAN",code(error),{student,enrollment},error);}
      }
      return {student,enrollment,guardian};
    },
  };
}

export type StudentOnboardingFacade=ReturnType<typeof createStudentOnboardingUseCases>;
