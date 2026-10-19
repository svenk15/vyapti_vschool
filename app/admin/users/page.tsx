import {loadAdminHome} from "@/lib/server/admin-page";
import {adminGateway} from "@/lib/server/access";
import {getIdentity} from "@/lib/server/auth";
import {StaffManagement} from "@/components/access-management";
import {Alert,BrandSurface} from "@/components/ui/primitives";
import {peopleAvailabilityGateway,peopleGateway} from "@/lib/server/people";
import {AdminStaffNavigation} from "@/components/admin-staff-navigation";
export const dynamic="force-dynamic";
export default async function UsersPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=await searchParams,targetMembershipId=typeof params.membershipId==='string'?params.membershipId:null,home=await loadAdminHome();if(!home)return <Alert tone="danger" title="Staff service unavailable"/>;const identity=await getIdentity(),today=new Intl.DateTimeFormat('en-CA',{timeZone:home.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),[staff,people,availability]=await Promise.all([adminGateway.listMembers(identity,home.scope.schoolId).catch(()=>null),peopleGateway.workspace(identity,{limit:100}).catch(()=>null),peopleAvailabilityGateway.recorder(identity,today).then(()=>true).catch(()=>false)]);if(!staff)return <Alert tone="danger" title="Service unavailable">Refresh or sign in again.</Alert>;return <BrandSurface><main id="main-content" className="container page-space"><AdminStaffNavigation current="access" profiles={!!people} access availability={availability}/><StaffManagement initial={staff} employees={people?.employees??[]} employeeDirectoryAvailable={!!people} schoolId={home.scope.schoolId} institutionName={home.institutionName} schoolName={home.schoolName} targetMembershipId={targetMembershipId}/></main></BrandSurface>;}
