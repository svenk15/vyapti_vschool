import 'server-only';
import {redirect} from 'next/navigation';
import {AccessError} from '../../backend/modules/access/contracts';
import {GuardianError} from '../../backend/modules/guardians/contracts';
import type {GuardianChildSummary,GuardianWorkspace} from '../../shared/contracts/guardians';
import {getIdentity} from './auth';
import {guardiansGateway} from './guardians';
import {appearanceGateway} from './access';
import type {ThemeId} from '../../shared/contracts/branding';

export async function familyPageContext(candidate?:string):Promise<{identity:NonNullable<Awaited<ReturnType<typeof getIdentity>>>;workspace:GuardianWorkspace;selected:GuardianChildSummary&Readonly<{theme:ThemeId}>}>{
 const identity=await getIdentity();if(!identity)redirect('/sign-in');
 try{const workspace=await guardiansGateway.workspace(identity);if(!workspace.children.length)redirect('/family/access-unavailable');const selected=workspace.children.find(child=>child.studentId===candidate)??workspace.children[0],theme=await appearanceGateway.getVerifiedPortalTheme(identity,selected.organizationId,selected.schoolId,'GUARDIAN_CHILD');return {identity,workspace,selected:{...selected,theme:theme.themeId}};}
 catch(error){if((error instanceof GuardianError||error instanceof AccessError)&&error.code==='UNAUTHENTICATED')redirect('/sign-in');if((error instanceof GuardianError||error instanceof AccessError)&&['FORBIDDEN','NOT_FOUND','MODULE_NOT_LICENSED','MODULE_DISABLED','RELEASE_UNAVAILABLE'].includes(error.code))redirect('/family/access-unavailable');throw error;}
}
