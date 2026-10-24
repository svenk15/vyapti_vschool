import {redirect} from 'next/navigation';
import {AccessError} from '@/backend/modules/access/contracts';
import {Alert,BrandSurface,ButtonLink,PageHeader,PageStack} from '@/components/ui/primitives';
import {AttendanceReportWorkspace} from '@/components/attendance/report-workspace';
import {shiftDay,validDay} from '@/components/attendance/presentation';
import {getIdentity} from '@/lib/server/auth';
import {accountGateway} from '@/lib/server/access';
import {reportingGateway} from '@/lib/server/reporting';
import {schoolDate} from '@/backend/modules/attendance/domain/schedule';
export const dynamic='force-dynamic';
const first=(value:string|string[]|undefined)=>Array.isArray(value)?undefined:value;
export default async function AttendanceReportPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const identity=await getIdentity(),params=await searchParams;let report,today='',timezone='UTC',canExport=false,error:unknown;
 try{const home=await accountGateway.getHome(identity);timezone=home.timezone;canExport=home.capabilities.includes('attendance.export');today=schoolDate(new Date(),timezone);const fromDate=first(params.fromDate)??today,toDate=first(params.toDate)??shiftDay(today,1);if(!validDay(fromDate)||!validDay(toDate))throw new AccessError('VALIDATION');report=await reportingGateway.overview(identity,{fromDate,toDate,yearId:first(params.yearId),sectionId:first(params.sectionId),subjectId:first(params.subjectId),limit:50});}catch(cause){error=cause;}
 if(error instanceof AccessError&&error.code==='UNAUTHENTICATED')redirect('/sign-in');
 return <BrandSurface><main id="main-content" className="container page-space"><PageStack className="attendance-report-page">{report?<AttendanceReportWorkspace key={JSON.stringify(params)} report={report} canExport={canExport} today={today} timezone={timezone}/>:<><PageHeader title="Attendance"/><Alert tone="danger" title="Report unavailable">{error instanceof AccessError&&error.code==='VALIDATION'?'Choose a valid period of up to 31 days.':'Current access or reporting availability could not be verified. Refresh to retry.'}</Alert><ButtonLink variant="secondary" href="/admin/reports/attendance">Return to today’s report</ButtonLink></>}</PageStack></main></BrandSurface>;
}
