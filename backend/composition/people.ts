import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaPeopleRepository} from '../modules/people/infrastructure/employees';
import {createPeopleUseCases} from '../modules/people/application/employees';
import {PrismaInstitutionEvidence} from '../modules/tenancy/infrastructure/evidence';
export function createPeopleServices(config:{databaseUrl:string;cursorSecret?:string;now?:()=>Date}){
 const db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]});
 return {...createPeopleUseCases(new PrismaPeopleRepository(db,tx=>new PrismaInstitutionEvidence(tx),config.now,config.cursorSecret??process.env.NEXTAUTH_SECRET??'')),disconnect:()=>db.$disconnect()};
}
