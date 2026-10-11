import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {accountGateway} from '@/lib/server/access';
import {getIdentity} from '@/lib/server/auth';
import {moduleGateway} from '@/lib/server/tenancy';
import {Alert,Badge,BrandSurface,Card,PageHeader,PageStack,SectionHeader} from '@/components/ui/primitives';

export const dynamic='force-dynamic';

export default async function TimetableReadinessPage(){
 const identity=await getIdentity();
 let home:Awaited<ReturnType<typeof accountGateway.getHome>>|undefined;
 let configuration:Awaited<ReturnType<typeof moduleGateway.getCurrent>>|undefined;
 let failure:unknown;
 try{
  [home,configuration]=await Promise.all([accountGateway.getHome(identity),moduleGateway.getCurrent(identity)]);
 }catch(error){failure=error;}
 if(!home||!configuration){
  if(failure instanceof AccessError&&failure.code==='UNAUTHENTICATED')redirect('/sign-in');
  const denied=failure instanceof AccessError&&(failure.code==='FORBIDDEN'||failure.code==='NOT_FOUND');
  return <BrandSurface><main id="main-content" className="container page-space"><PageHeader title="Timetable readiness"/><Alert tone={denied?'warning':'danger'} title={denied?'Readiness access denied':'Readiness unavailable'}>{denied?'A current authorized branch administrator is required.':'Refresh to try again.'}</Alert></main></BrandSurface>;
 }
 const timetable=configuration.modules.find(item=>item.moduleId==='timetable');
 if(!timetable)return <BrandSurface><main id="main-content" className="container page-space"><PageHeader title="Timetable readiness"/><Alert tone="danger" title="Readiness unavailable">The Timetable catalog entry is unavailable.</Alert></main></BrandSurface>;
 const permission=home.capabilities.includes('timetable.manage');
 return <BrandSurface><main id="main-content" className="container page-space"><PageStack>
   <PageHeader eyebrow={`${home.institutionName} · ${home.schoolName}`} title="Timetable readiness" description="Review the live prerequisites before timetable planning is enabled for this branch."/>
   <Alert tone="info" title="Planning is not active">This checkpoint reports readiness only. It does not create a timetable, publish sessions or change Attendance.</Alert>
   <Card className="padded settings-panel"><SectionHeader title="Current branch prerequisites" description="Release, licensing, activation and current permission are checked independently."/>
    <div className="timetable-readiness-list">
     <div className="timetable-readiness-row"><div><strong>Trusted release</strong><p className="small muted">The server release manifest must include Timetable.</p></div><Badge tone={timetable.releaseAvailable?'success':'warning'}>{timetable.releaseAvailable?'Available':'Unavailable'}</Badge></div>
     <div className="timetable-readiness-row"><div><strong>Institution entitlement</strong><p className="small muted">A current institution entitlement is required.</p></div><Badge tone={timetable.licensedState==='ACTIVE'?'success':'warning'}>{timetable.licensedState??'Not licensed'}</Badge></div>
     <div className="timetable-readiness-row"><div><strong>Branch activation</strong><p className="small muted">Activation never follows automatically from licensing.</p></div><Badge tone={timetable.activationState==='ACTIVE'?'success':'warning'}>{timetable.activationState}</Badge></div>
     <div className="timetable-readiness-row"><div><strong>Planning permission</strong><p className="small muted">Current resource authorization remains required after activation.</p></div><Badge tone={permission?'success':'warning'}>{permission?'Granted':'Not granted'}</Badge></div>
    </div>
   </Card>
   {timetable.blockingReasons.length?<Card className="padded settings-panel"><SectionHeader title="Blocking conditions" description="Resolve these through their owning configuration workflows."/><ul className="validation-list">{timetable.blockingReasons.map(reason=><li key={reason}>{reason.replaceAll('_',' ').toLowerCase()}</li>)}</ul></Card>:null}
 </PageStack></main></BrandSurface>;
}
