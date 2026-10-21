import "server-only";
import {randomUUID} from "node:crypto";
import {createStudentOnboardingServices} from "../../backend/composition/student-onboarding";
import {studentsGateway} from "./students";
import {guardiansGateway} from "./guardians";

export const studentOnboardingGateway=createStudentOnboardingServices({
  students:{
    register:(actor,input)=>studentsGateway.create(actor,input),
    enroll:(actor,input)=>studentsGateway.enroll(actor,input),
  },
  guardians:{
    authorize:(actor,studentId,input)=>guardiansGateway.authorize(actor,studentId,input),
  },
  requestId:randomUUID,
});
