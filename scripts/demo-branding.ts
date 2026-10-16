import {config} from 'dotenv';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {deflateSync} from 'node:zlib';
import {createAccessServices} from '../backend/composition/access';
import {createBrandingServices} from '../backend/composition/branding';
import type {BrandFields} from '../shared/contracts/branding-management';
config({path:'.env.local',quiet:true});config({quiet:true});

const privateDir='artifacts/branding-02';
type Seed=Readonly<{slug:string;createKey:string;uploadKey:string;publishKey:string}>;
function demoPng(){
 const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0;}
 const crc=(b:Uint8Array)=>{let c=0xffffffff;for(const x of b)c=table[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
 const chunk=(name:string,data:Uint8Array)=>{const b=new Uint8Array(data.length+12),v=new DataView(b.buffer);v.setUint32(0,data.length);for(let i=0;i<4;i++)b[i+4]=name.charCodeAt(i);b.set(data,8);v.setUint32(data.length+8,crc(b.subarray(4,data.length+8)));return b;};
 const header=new Uint8Array(13),v=new DataView(header.buffer);v.setUint32(0,1);v.setUint32(4,1);header.set([8,2,0,0,0],8);
 const parts=[Uint8Array.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(Uint8Array.from([0,90,110,160]))),chunk('IEND',new Uint8Array())];
 const result=new Uint8Array(parts.reduce((size,p)=>size+p.length,0));let offset=0;for(const part of parts){result.set(part,offset);offset+=part.length;}return result;
}
async function main(){
 const base=process.env.DATABASE_URL??'',dbUrl=new URL(base),iam=JSON.parse(readFileSync('artifacts/iam-01/private-demo.json','utf8')) as {email:string;password:string;organizationId:string;schoolId:string;schoolName:string};
 if(!['127.0.0.1','localhost','[::1]'].includes(dbUrl.hostname)||dbUrl.pathname!=='/vyapti_vschool'||dbUrl.search)throw new Error('LOCAL_DEVELOPMENT_DATABASE_REQUIRED');
 const access=createAccessServices({databaseUrl:base}),auth=await access.authenticate(iam.email,iam.password);await access.disconnect();if(!auth)throw new Error('SYNTHETIC_DEMO_ACCOUNT_REQUIRED');
 const services=createBrandingServices({databaseUrl:base}),statePath=`${privateDir}/private-command.json`;let seed:Seed;
 if(existsSync(statePath))seed=JSON.parse(readFileSync(statePath,'utf8')) as Seed;
 else {seed={slug:`vschool-demo-${iam.schoolId.slice(0,8)}`,createKey:randomUUID(),uploadKey:randomUUID(),publishKey:randomUUID()};mkdirSync(privateDir,{recursive:true,mode:0o700});writeFileSync(statePath,JSON.stringify(seed,null,2)+'\n',{flag:'wx',mode:0o600});}
 const fields:BrandFields={displayName:iam.schoolName,branchLabel:iam.schoolName,palette:'forest',welcome:'Welcome to your school',supportEmail:'support@vschool.example',locale:'en-IN',logoAssetId:null};
 try{
  let state=await services.workspace(auth,iam.organizationId,iam.schoolId);
  if(!state.profileId){await services.createProfile(auth,iam.organizationId,iam.schoolId,{slug:seed.slug,fields,key:seed.createKey,reason:'Prepare synthetic BRD-02 local demo'});state=await services.workspace(auth,iam.organizationId,iam.schoolId);}
  if(state.slug!==seed.slug||!state.profileId||!state.draft)throw new Error('BRANDING_DEMO_PROFILE_MISMATCH');
  if(!state.draft.logoAssetId){await services.uploadLogo(auth,iam.organizationId,iam.schoolId,state.profileId,{version:state.version,key:seed.uploadKey,reason:'Add synthetic sanitized demo logo'},demoPng());state=await services.workspace(auth,iam.organizationId,iam.schoolId);}
  if(!state.published){await services.publish(auth,iam.organizationId,iam.schoolId,state.profileId,{version:state.version,key:seed.publishKey,reason:'Publish synthetic local sign-in demo'});state=await services.workspace(auth,iam.organizationId,iam.schoolId);}
  console.log(`BRD-02 local demo is ready at /sign-in/${state.slug}; the profile is published and its logo is stored as a sanitized derivative.`);
 } finally {await services.disconnect();}
}
main().catch(error=>{const code=error&&typeof error==='object'&&'code'in error&&typeof error.code==='string'?error.code:'LOCAL_DEMO_ERROR';console.error(`BRANDING_DEMO_FAILED (${code}): confirm the existing synthetic IAM artifact and local development database.`);process.exitCode=1;});
