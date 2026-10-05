import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {BrandSurface,Alert,ButtonLink,PageHeader} from '@/components/ui/primitives';
import {BranchSwitcher} from '@/components/institution-context';
import {ClassesWorkspace} from '@/components/classes-workspace';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {academicsGateway} from '@/lib/server/academics';
import {peopleGateway} from '@/lib/server/people';
import type {CourseOfferingRecord} from '@/shared/contracts/academics';
export const dynamic='force-dynamic';
export default async function ClassesAdminPage(){const identity=await getIdentity();let home,workspace;let initialOfferings:CourseOfferingRecord[]=[];let initialTeachers:Awaited<ReturnType<typeof peopleGateway.workspace>>['employees'][number][]=[];try{home=await accountGateway.getHome(identity);workspace=await academicsGateway.workspace(identity);const openYear=workspace.years.find(y=>y.status==='OPEN');if(openYear)initialOfferings=await academicsGateway.offerings(identity,openYear.id);const staff=await peopleGateway.workspace(identity,{limit:100});initialTeachers=staff.employees.filter(x=>x.teachingEligibility==='ENABLED'&&x.employment.status==='ACTIVE'&&x.teacherId);}catch(e){if(e instanceof AccessError&&e.code==='UNAUTHENTICATED')redirect('/sign-in');return <BrandSurface><main className="container page-space"><PageHeader title="Classes and teachers" actions={<ButtonLink href="/admin" variant="secondary">School home</ButtonLink>}/><Alert tone="danger" title="Class setup access denied">The current branch, academic module and class.manage permission are checked on the server.</Alert></main></BrandSurface>;}return <BrandSurface><main id="main-content" className="container page-space"><BranchSwitcher home={home}/><ClassesWorkspace initial={workspace} initialOfferings={initialOfferings} initialTeachers={initialTeachers} schoolName={home.schoolName} institutionName={home.institutionName}/></main></BrandSurface>;}
