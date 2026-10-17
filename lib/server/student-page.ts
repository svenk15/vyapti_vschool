import 'server-only';
import {redirect} from 'next/navigation';
import {AccessError} from '../../backend/modules/access/contracts';
import {StudentPortalError} from '../../backend/modules/students/domain/portal-policy';
import type {StudentPortalContext,StudentPortalWorkspace} from '../../shared/contracts/student-portal';
import type {StudentPortalPurpose} from '../../shared/contracts/student-portal';
import {getIdentity} from './auth';
import {studentPortalGateway} from './student-portal';
export async function studentPageContext(candidate?:string,requiredPurpose:StudentPortalPurpose='profile.read_self'):Promise<{identity:NonNullable<Awaited<ReturnType<typeof getIdentity>>>;workspace:StudentPortalWorkspace;selected:StudentPortalContext}>{const identity=await getIdentity();if(!identity)redirect('/sign-in');try{const workspace=await studentPortalGateway.workspace(identity);if(!workspace.contexts.length)redirect('/student/access-unavailable');const selected=(candidate?workspace.contexts.find(context=>context.studentId===candidate):undefined)??workspace.contexts[0];if(!selected.purposes.includes(requiredPurpose))redirect('/student/access-unavailable');return {identity,workspace,selected};}catch(error){if((error instanceof StudentPortalError||error instanceof AccessError)&&error.code==='UNAUTHENTICATED')redirect('/sign-in');if((error instanceof StudentPortalError||error instanceof AccessError)&&['FORBIDDEN','NOT_FOUND','MODULE_NOT_LICENSED','MODULE_DISABLED','RELEASE_UNAVAILABLE'].includes(error.code))redirect('/student/access-unavailable');throw error;}}
