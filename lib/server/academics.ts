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
};
