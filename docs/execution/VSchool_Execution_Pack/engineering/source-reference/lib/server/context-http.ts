import 'server-only';
import { cookies } from 'next/headers';
import { getIdentity } from './auth';
import { contextGateway } from './access';
import { managementError } from './management-http';
import { AccessError } from '../../backend/modules/access/contracts';
const headers={'Cache-Control':'private, no-store'};
async function body(request:Request){
 if(!process.env.NEXTAUTH_URL||request.headers.get('origin')!==new URL(process.env.NEXTAUTH_URL).origin)throw new AccessError('FORBIDDEN');
 const reader=request.body?.getReader();let text='';const decoder=new TextDecoder();let length=0;
 if(reader)for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>8192){await reader.cancel();throw new AccessError('VALIDATION');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();
 try{return JSON.parse(text);}catch{throw new AccessError('VALIDATION');}
}
export async function directory(){try{return Response.json(await contextGateway.getContexts(await getIdentity()),{headers});}catch(e){return managementError(e);}}
export async function switchContext(request:Request){try{const input=await body(request),identity=await getIdentity(),home=await contextGateway.switchContext(identity,input?.institutionId,input?.branchId);
 (await cookies()).set('vschool-context',JSON.stringify({accountId:identity!.accountId,organizationId:home.scope.organizationId,schoolId:home.scope.schoolId}),{httpOnly:true,sameSite:'lax',secure:new URL(process.env.NEXTAUTH_URL!).protocol==='https:',path:'/',maxAge:8*60*60});
 return Response.json(home,{headers});}catch(e){return managementError(e);}}
export async function createBranch(request:Request,organizationId:string){try{return Response.json(await contextGateway.createBranch(await getIdentity(),organizationId,await body(request)),{status:201,headers});}catch(e){return managementError(e);}}
