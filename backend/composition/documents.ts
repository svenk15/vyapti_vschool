import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '../../generated/prisma/client';
import {AccessError} from '../modules/access/contracts/index';
import {createDocumentsUseCases} from '../modules/documents/application/documents';
import {ClamAvScanner} from '../modules/documents/infrastructure/clamav-scanner';
import {PrismaDocumentsRepository} from '../modules/documents/infrastructure/documents';
import {LocalPrivateObjectStorage} from '../modules/documents/infrastructure/local-storage';
import {PrismaCommunicationDocumentAuthorization} from '../modules/communication/infrastructure/document-authorization';
import {PrismaAssessmentsDocumentAuthorization} from '../modules/assessments/infrastructure/document-authorization';
import {RoutedDocumentOwnerAuthorization} from '../modules/documents/infrastructure/owner-authorization';
import {capabilityReleaseManifest,isModuleId,type ModuleId} from '../modules/tenancy/domain/entitlements';
import {PrismaVerifiedDatabaseContext} from '../modules/tenancy/infrastructure/verified-db-context';

export function createDocumentsServices(config:{databaseUrl:string;releasedModules:readonly ModuleId[];localStorageRoot:string;clamAvExecutable:string|null;clamAvDatabaseDirectory:string|null;maxDefinitionsAgeMs:number;now?:()=>Date}){
 if(!config.databaseUrl||!config.localStorageRoot||config.releasedModules.some(id=>!isModuleId(id))||!Number.isSafeInteger(config.maxDefinitionsAgeMs)||config.maxDefinitionsAgeMs<1)throw new AccessError('UNAVAILABLE');
 const target=new URL(config.databaseUrl);if(!['localhost','127.0.0.1','[::1]'].includes(target.hostname)||!['/vyapti_vschool','/vyapti_vschool_test'].includes(target.pathname))throw new AccessError('UNAVAILABLE');
 const now=config.now??(()=>new Date()),db=new PrismaClient({adapter:new PrismaPg({connectionString:config.databaseUrl,connectionTimeoutMillis:5000,max:5}),log:[]}),context=new PrismaVerifiedDatabaseContext(),manifest=capabilityReleaseManifest(config.releasedModules),owner=new RoutedDocumentOwnerAuthorization({communication:new PrismaCommunicationDocumentAuthorization(manifest,now),assessments:new PrismaAssessmentsDocumentAuthorization(manifest,now)}),storage=new LocalPrivateObjectStorage(config.localStorageRoot,true),scanner=new ClamAvScanner(config.clamAvExecutable,config.clamAvDatabaseDirectory,config.maxDefinitionsAgeMs,now),repository=new PrismaDocumentsRepository(db,context,owner,storage,scanner,now);return {...createDocumentsUseCases(repository),disconnect:()=>db.$disconnect()};
}
