import 'server-only';
import {headers} from 'next/headers';
import {createBrandingServices} from '../../backend/composition/branding';
import type {BrandingFacade} from '../../backend/modules/branding/application/brands';
import {accountGateway} from './access';
import {getIdentity} from './auth';
const service=createBrandingServices({databaseUrl:process.env.DATABASE_URL??''});
async function scope(identity:Parameters<BrandingFacade['workspace']>[0]){const home=await accountGateway.getHome(identity);return home.scope;}
export const brandingGateway={
 async workspace(identity:Parameters<BrandingFacade['workspace']>[0]){const s=await scope(identity);return service.workspace(identity,s.organizationId,s.schoolId);},
 async createProfile(identity:Parameters<BrandingFacade['createProfile']>[0],input:Parameters<BrandingFacade['createProfile']>[3]){const s=await scope(identity);return service.createProfile(identity,s.organizationId,s.schoolId,input);},
 async preview(identity:Parameters<BrandingFacade['preview']>[0],input:Parameters<BrandingFacade['preview']>[3]){const s=await scope(identity);return service.preview(identity,s.organizationId,s.schoolId,input);},
 async saveDraft(identity:Parameters<BrandingFacade['saveDraft']>[0],profile:string,input:Parameters<BrandingFacade['saveDraft']>[4]){const s=await scope(identity);return service.saveDraft(identity,s.organizationId,s.schoolId,profile,input);},
 async uploadLogo(identity:Parameters<BrandingFacade['uploadLogo']>[0],profile:string,input:Parameters<BrandingFacade['uploadLogo']>[4],bytes:Uint8Array){const s=await scope(identity);return service.uploadLogo(identity,s.organizationId,s.schoolId,profile,input,bytes);},
 async publish(identity:Parameters<BrandingFacade['publish']>[0],profile:string,input:Parameters<BrandingFacade['publish']>[4]){const s=await scope(identity);return service.publish(identity,s.organizationId,s.schoolId,profile,input);},
 async rollback(identity:Parameters<BrandingFacade['rollback']>[0],profile:string,input:Parameters<BrandingFacade['rollback']>[4]){const s=await scope(identity);return service.rollback(identity,s.organizationId,s.schoolId,profile,input);},
 async startHostChallenge(identity:Parameters<BrandingFacade['startHostChallenge']>[0],profile:string,hostname:unknown){const s=await scope(identity);return service.startHostChallenge(identity,s.organizationId,s.schoolId,profile,{hostname});},
 async verifyHost(identity:Parameters<BrandingFacade['verifyHost']>[0],profile:string,hostname:unknown,token:unknown){const s=await scope(identity);return service.verifyHost(identity,s.organizationId,s.schoolId,profile,{hostname,token});},
 async publicBrand(slug:string,host:string){const canonical=process.env.NEXTAUTH_URL?new URL(process.env.NEXTAUTH_URL).host:'';return service.publicBrand(slug,host,canonical);},
 async publicAsset(id:string,hash:string){return service.publicAsset(id,hash);},
};
export async function requestHost(){return (await headers()).get('host')??'';}
export async function requestIdentity(){return getIdentity();}
