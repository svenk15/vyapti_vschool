import {FacilitiesIncidentList} from '@/components/facilities-workspace';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {facilitiesGateway} from '@/lib/server/facilities';

export const dynamic='force-dynamic';

export default async function Page(){
 const identity=await getIdentity();
 let data:Awaited<ReturnType<typeof facilitiesGateway.list>>|null=null,candidates:Awaited<ReturnType<typeof facilitiesGateway.candidates>>=[];
 try{[data,candidates]=await Promise.all([facilitiesGateway.list(identity),facilitiesGateway.candidates(identity).catch(()=>[])]);}catch{}
 return <main id="main-content" className="container page-space">{data?<FacilitiesIncidentList items={data} baseHref="/admin/services/incidents" canCreate={candidates.length>0}/>:<Alert tone="danger" title="Facilities incidents unavailable">Current branch and exact Facilities purpose are required.</Alert>}</main>;
}
