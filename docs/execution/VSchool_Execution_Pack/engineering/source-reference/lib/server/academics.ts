import 'server-only';
import {createAcademicServices} from '../../backend/composition/academics';
import type {AcademicSetupFacade} from '../../backend/modules/academics/application/setup';
import {accountGateway} from './access';
import type {Identity} from '../../shared/contracts/access';
const academics=createAcademicServices({databaseUrl:process.env.DATABASE_URL??''});
async function scope(identity:Identity|null){const home=await accountGateway.getHome(identity);return home.scope;}
export const academicsGateway={
 async workspace(identity:Identity|null){const s=await scope(identity);return academics.workspace(identity,s.organizationId,s.schoolId);},
 async createYear(identity:Identity|null,input:Parameters<AcademicSetupFacade['createYear']>[3]){const s=await scope(identity);return academics.createYear(identity,s.organizationId,s.schoolId,input);},
 async replaceTerms(identity:Identity|null,yearId:string,input:Parameters<AcademicSetupFacade['replaceTerms']>[4]){const s=await scope(identity);return academics.replaceTerms(identity,s.organizationId,s.schoolId,yearId,input);},
 async createGrade(identity:Identity|null,input:Parameters<AcademicSetupFacade['createGrade']>[3]){const s=await scope(identity);return academics.createGrade(identity,s.organizationId,s.schoolId,input);},
 async createSubject(identity:Identity|null,input:Parameters<AcademicSetupFacade['createSubject']>[3]){const s=await scope(identity);return academics.createSubject(identity,s.organizationId,s.schoolId,input);},
 async createSection(identity:Identity|null,input:Parameters<AcademicSetupFacade['createSection']>[3]){const s=await scope(identity);return academics.createSection(identity,s.organizationId,s.schoolId,input);},
 async publishCalendar(identity:Identity|null,calendarId:string,input:Parameters<AcademicSetupFacade['publishCalendar']>[4]){const s=await scope(identity);return academics.publishCalendar(identity,s.organizationId,s.schoolId,calendarId,input);},
 async evaluateCalendar(identity:Identity|null,calendarId:string,query:Parameters<AcademicSetupFacade['evaluateCalendar']>[4]){const s=await scope(identity);return academics.evaluateCalendar(identity,s.organizationId,s.schoolId,calendarId,query);},
 async transitionYear(identity:Identity|null,yearId:string,input:Parameters<AcademicSetupFacade['transitionYear']>[4]){const s=await scope(identity);return academics.transitionYear(identity,s.organizationId,s.schoolId,yearId,input);},
 async offerings(identity:Identity|null,yearId:string){const s=await scope(identity);return academics.list(identity,s.organizationId,s.schoolId,yearId);},
 async createOffering(identity:Identity|null,input:Parameters<typeof academics.create>[3]){const s=await scope(identity);return academics.create(identity,s.organizationId,s.schoolId,input);},
 async assignTeacher(identity:Identity|null,input:Parameters<typeof academics.assign>[3]){const s=await scope(identity);return academics.assign(identity,s.organizationId,s.schoolId,input);},
 async endTeacherAssignment(identity:Identity|null,id:string,input:Parameters<typeof academics.end>[4]){const s=await scope(identity);return academics.end(identity,s.organizationId,s.schoolId,id,input);},
};
