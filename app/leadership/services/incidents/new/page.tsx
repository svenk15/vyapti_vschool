import {FacilitiesIncidentComposer} from '@/components/facilities-workspace';
import {Alert} from '@/components/ui/primitives';
import {getIdentity} from '@/lib/server/auth';
import {facilitiesGateway} from '@/lib/server/facilities';
import {accountGateway} from '@/lib/server/access';

export const dynamic='force-dynamic';

export default async function Page(){
 const identity=await getIdentity();
 let data:{candidates:Awaited<ReturnType<typeof facilitiesGateway.candidates>>;timezone:string}|null=null;
 try{const [candidates,home]=await Promise.all([facilitiesGateway.candidates(identity),accountGateway.getHome(identity)]);data={candidates,timezone:home.timezone};}catch{}
 return data?<FacilitiesIncidentComposer candidates={data.candidates} timezone={data.timezone} backHref="/leadership/services/incidents"/>:<Alert tone="danger" title="Incident reporting unavailable">An exact reporter purpose and eligible coordinator are required.</Alert>;
}
