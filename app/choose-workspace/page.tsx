import {redirect} from 'next/navigation';
import {WorkspaceChooser} from '@/components/workspace-chooser';
import {AuthLayout} from '@/components/auth-layout';
import {accountGateway,contextGateway} from '@/lib/server/access';
import {moduleGateway} from '@/lib/server/tenancy';
import {getIdentity} from '@/lib/server/auth';
import {AccessError} from '@/backend/modules/access/contracts';
import {AccessSignOut} from '@/components/access-login';
import {Alert} from '@/components/ui/primitives';
import type {ContextDirectory} from '@/shared/contracts/tenancy';

export const dynamic='force-dynamic';

export default async function ChooseWorkspacePage(){
 const identity=await getIdentity();
 if(!identity)redirect('/sign-in');
 let directory:ContextDirectory;
 try{directory=await contextGateway.getContexts(identity);}catch(error){
  if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
  if(error instanceof AccessError&&error.code==='NOT_FOUND')return <AuthLayout eyebrow="School workspace" title="Access needs attention" description="No active branch is available for this account." backHref="/sign-in" backLabel="Back to sign in"><div className="control-stack"><Alert tone="warning" title="No active workspace">Ask your school administrator or support contact to review your branch access.</Alert><AccessSignOut/></div></AuthLayout>;
  return <AuthLayout eyebrow="School workspace" title="Choose your workspace" description="Only branches you are authorized to use appear here." backHref="/sign-in" backLabel="Back to sign in"><div className="control-stack"><Alert tone="danger" title="Workspaces unavailable">Authorized branches could not be loaded. Try again later.</Alert><AccessSignOut/></div></AuthLayout>;
 }
 const branches=directory.institutions.flatMap(institution=>institution.branches.filter(branch=>branch.selectable).map(branch=>({institutionId:institution.id,institutionName:institution.name,branchId:branch.id,branchName:branch.name,branchCode:branch.code})));
 if(branches.length===0)return <AuthLayout eyebrow="School workspace" title="Access needs attention" description="No active branch is available for this account." backHref="/sign-in" backLabel="Back to sign in"><div className="control-stack"><Alert tone="warning" title="No active workspace">Ask your school administrator or support contact to review your branch access.</Alert><AccessSignOut/></div></AuthLayout>;
 if(branches.length===1){
  const branch=branches[0],home=await accountGateway.getHome(identity,branch.branchId);
  const canTeach=home.capabilities.includes('attendance.mark')&&await moduleGateway.canUseAtScope(identity,home.scope.organizationId,home.scope.schoolId,'attendance','attendance.mark');
  redirect(canTeach?'/teacher/today':'/account');
 }
 return <AuthLayout eyebrow="School workspace" title="Choose your workspace" description="Only branches you are authorized to use appear here." backHref="/sign-in" backLabel="Back to sign in"><WorkspaceChooser branches={branches}/></AuthLayout>;
}
