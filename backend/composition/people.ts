import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaPeopleRepository} from '../modules/people/infrastructure/employees';
import {createPeopleUseCases} from '../modules/people/application/employees';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
import {PrismaVerifiedPersonBinding} from '../modules/access/infrastructure/person-binding';
import {PrismaTeacherProfile} from '../modules/academics/infrastructure/teacher-profile';
import {capabilityReleaseManifest,releasedModuleIds,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export function createPeopleServices(config:{databaseUrl:string;cursorSecret?:string;now?:()=>Date;releasedModules?:readonly ModuleId[]}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
 const manifest=capabilityReleaseManifest(config.releasedModules??releasedModuleIds(process.env.VSCHOOL_RELEASED_MODULES));
 return {...createPeopleUseCases(new PrismaPeopleRepository(db,tx=>new PrismaInstitutionEvidence(tx),config.now,config.cursorSecret??process.env.NEXTAUTH_SECRET??'',new PrismaVerifiedPersonBinding(),new PrismaTeacherProfile(),manifest,new PrismaVerifiedDatabaseContext())),disconnect:()=>db.$disconnect()};
}
