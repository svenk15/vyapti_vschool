import "server-only";
import { createStudentsServices } from "../../backend/composition/students";
import type { StudentsFacade } from "../../backend/modules/students/application/students";
import type { Identity } from "../../shared/contracts/access";
import { accountGateway } from "./access";
import {AccessError} from '../../backend/modules/access/contracts';
import {studentRuntimeConfiguration} from './student-runtime-configuration';

type StudentServices=ReturnType<typeof createStudentsServices>;
let students:StudentServices|undefined,configurationFailure:AccessError|undefined;
try{students=createStudentsServices(studentRuntimeConfiguration());}catch{configurationFailure=new AccessError('UNAVAILABLE');}
function service(){if(!students)throw configurationFailure??new AccessError('UNAVAILABLE');return students;}
async function scope(identity:Identity|null){return (await accountGateway.getHome(identity)).scope;}
export const studentsGateway={
  async list(identity:Identity|null,query:{search?:unknown;cursor?:unknown;limit?:unknown;status?:unknown}={}){const current=await scope(identity);return service().list(identity,current.organizationId,current.schoolId,query);},
  async get(identity:Identity|null,studentId:string){const current=await scope(identity);return service().get(identity,current.organizationId,current.schoolId,studentId);},
  async create(identity:Identity|null,input:Parameters<StudentsFacade["create"]>[3]){const current=await scope(identity);return service().create(identity,current.organizationId,current.schoolId,input);},
  async findExistingPeople(identity:Identity|null,exactName:unknown){const current=await scope(identity);return service().findExistingPeople(identity,current.organizationId,current.schoolId,exactName);},
  async enrollmentOptions(identity:Identity|null,studentId:unknown){const current=await scope(identity);return service().enrollmentOptions(identity,current.organizationId,current.schoolId,studentId);},
  async enroll(identity:Identity|null,input:Parameters<StudentsFacade["enroll"]>[3]){const current=await scope(identity);return service().enroll(identity,current.organizationId,current.schoolId,input);},
  async transfer(identity:Identity|null,enrollmentId:string,input:Parameters<StudentsFacade["transfer"]>[4]){const current=await scope(identity);return service().transfer(identity,current.organizationId,current.schoolId,enrollmentId,input);},
  async archive(identity:Identity|null,studentId:string,input:Parameters<StudentsFacade["archive"]>[4]){const current=await scope(identity);return service().archive(identity,current.organizationId,current.schoolId,studentId,input);},
};
