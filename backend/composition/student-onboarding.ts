import {
  createStudentOnboardingUseCases,
  type StudentOnboardingGuardiansPort,
  type StudentOnboardingStudentsPort,
} from "../modules/students/application/onboarding";

export function createStudentOnboardingServices(input:{
  students:StudentOnboardingStudentsPort;
  guardians:StudentOnboardingGuardiansPort;
  requestId:()=>string;
}){
  return createStudentOnboardingUseCases(input.students,input.guardians,input.requestId);
}
