import "server-only";
import { createStudentsServices } from "../../backend/composition/students";
import type { StudentsFacade } from "../../backend/modules/students/application/students";
import type { Identity } from "../../shared/contracts/access";
import { accountGateway } from "./access";

const students=createStudentsServices({databaseUrl:process.env.DATABASE_URL??"",cursorSecret:process.env.NEXTAUTH_SECRET});
async function scope(identity:Identity|null){return (await accountGateway.getHome(identity)).scope;}
export const studentsGateway={
  async list(identity:Identity|null,query:{search?:unknown;cursor?:unknown;limit?:unknown;status?:unknown}={}){const current=await scope(identity);return students.list(identity,current.organizationId,current.schoolId,query);},
  async get(identity:Identity|null,studentId:string){const current=await scope(identity);return students.get(identity,current.organizationId,current.schoolId,studentId);},
  async create(identity:Identity|null,input:Parameters<StudentsFacade["create"]>[3]){const current=await scope(identity);return students.create(identity,current.organizationId,current.schoolId,input);},
  async findExistingPeople(identity:Identity|null,exactName:unknown){const current=await scope(identity);return students.findExistingPeople(identity,current.organizationId,current.schoolId,exactName);},
  async enrollmentOptions(identity:Identity|null,studentId:unknown){const current=await scope(identity);return students.enrollmentOptions(identity,current.organizationId,current.schoolId,studentId);},
  async enroll(identity:Identity|null,input:Parameters<StudentsFacade["enroll"]>[3]){const current=await scope(identity);return students.enroll(identity,current.organizationId,current.schoolId,input);},
};
