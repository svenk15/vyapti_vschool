import {PrismaClient} from '../../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {AccessError} from '../modules/access/contracts';
import {createActivityUseCases} from '../modules/platform/application/activity';
import {PrismaActivityRepository} from '../modules/platform/infrastructure/activity';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';
export type ActivityServiceConfiguration=Readonly<{databaseUrl:string;cursorSecret:string;today?:()=>string}>;
export function validateActivityServiceConfiguration(config:ActivityServiceConfiguration){if(typeof config.databaseUrl!=='string'||!config.databaseUrl.trim()||typeof config.cursorSecret!=='string'||config.cursorSecret.trim().length<32||config.today!==undefined&&typeof config.today!=='function')throw new AccessError('UNAVAILABLE');return config;}
export function createActivityServices(input:ActivityServiceConfiguration){const config=validateActivityServiceConfiguration(input),db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),repository=new PrismaActivityRepository(db,config.cursorSecret,new PrismaVerifiedDatabaseContext());return {...createActivityUseCases(repository,config.today??(()=>new Date().toISOString().slice(0,10))),disconnect:()=>db.$disconnect()};}
