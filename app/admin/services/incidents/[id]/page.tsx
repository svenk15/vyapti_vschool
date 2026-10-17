import {FacilitiesIncidentView} from '@/components/facilities-workspace';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {facilitiesGateway} from '@/lib/server/facilities';

export const dynamic='force-dynamic';

export default async function Page({params}:{params:Promise<{id:string}>}){
 let incident:Awaited<ReturnType<typeof facilitiesGateway.get>>|null=null;
 try{incident=await facilitiesGateway.get(await getIdentity(),(await params).id);}catch{}
 return <main id="main-content" className="container page-space">{incident?<FacilitiesIncidentView initial={incident} backHref="/admin/services/incidents"/>:<Alert tone="danger" title="Incident unavailable">The incident is outside your current branch or Facilities purpose.</Alert>}</main>;
}
