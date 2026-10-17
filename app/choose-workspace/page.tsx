import {redirect} from 'next/navigation';
import {WorkspaceChooser} from '@/components/workspace-chooser';
import {AuthLayout} from '@/components/auth-layout';
import {contextGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {AccessError} from '@/backend/modules/access/contracts';
import {AccessSignOut} from '@/components/access-login';
import {Alert} from '@/components/ui/primitives';
import type {ContextDirectory} from '@/shared/contracts/tenancy';
import {guardiansGateway} from '@/lib/server/guardians';
import {studentPortalGateway} from '@/lib/server/student-portal';

export const dynamic='force-dynamic';

export default async function ChooseWorkspacePage(){
 const identity=await getIdentity();
 if(!identity)redirect('/sign-in');
 const openPersonalWorkspace=async()=>{const student=await studentPortalGateway.workspace(identity).catch(()=>null);if(student?.contexts.length)redirect('/student');const family=await guardiansGateway.workspace(identity).catch(()=>null);if(family?.children.length)redirect('/family');};
 let directory:ContextDirectory;
 try{directory=await contextGateway.getContexts(identity);}catch(error){
  if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
  if(error instanceof AccessError&&error.code==='NOT_FOUND'){await openPersonalWorkspace();return <AuthLayout eyebrow="School workspace" title="Access needs attention" description="No active branch is available for this account." backHref="/sign-in" backLabel="Back to sign in"><div className="control-stack"><Alert tone="warning" title="No active workspace">Ask your school administrator or support contact to review your branch access.</Alert><AccessSignOut/></div></AuthLayout>;}
  return <AuthLayout eyebrow="School workspace" title="Choose your workspace" description="Only branches you are authorized to use appear here." backHref="/sign-in" backLabel="Back to sign in"><div className="control-stack"><Alert tone="danger" title="Workspaces unavailable">Authorized branches could not be loaded. Try again later.</Alert><AccessSignOut/></div></AuthLayout>;
 }
 const branches=directory.institutions.flatMap(institution=>institution.branches.filter(branch=>branch.selectable).flatMap(branch=>[
  ...(branch.roles.includes('PRINCIPAL')||branch.delegatedLeadership?[{institutionId:institution.id,institutionName:institution.name,branchId:branch.id,branchName:branch.name,branchCode:branch.code,workspace:'leadership' as const,workspaceLabel:branch.roles.includes('PRINCIPAL')?'Principal leadership':'Acting leadership'}]:[]),
  ...(branch.roles.includes('SCHOOL_ADMIN')?[{institutionId:institution.id,institutionName:institution.name,branchId:branch.id,branchName:branch.name,branchCode:branch.code,workspace:'administration' as const,workspaceLabel:'School administration'}]:[]),
  ...(branch.roles.includes('TEACHER')?[{institutionId:institution.id,institutionName:institution.name,branchId:branch.id,branchName:branch.name,branchCode:branch.code,workspace:'teaching' as const,workspaceLabel:'Teaching'}]:[]),
 ]));
 if(branches.length===0){await openPersonalWorkspace();return <AuthLayout eyebrow="School workspace" title="Access needs attention" description="No active branch is available for this account." backHref="/sign-in" backLabel="Back to sign in"><div className="control-stack"><Alert tone="warning" title="No active workspace">Ask your school administrator or support contact to review your branch access.</Alert><AccessSignOut/></div></AuthLayout>;}
 if(branches.length===1){
  const branch=branches[0];
  redirect(branch.workspace==='leadership'?'/leadership':branch.workspace==='teaching'?'/teacher/today':'/admin');
 }
 return <AuthLayout eyebrow="School workspace" title="Choose your workspace" description="Only branches you are authorized to use appear here." backHref="/sign-in" backLabel="Back to sign in"><WorkspaceChooser branches={branches}/></AuthLayout>;
}
