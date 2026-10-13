import {BrandSurface} from '@/components/ui/primitives';
import {FamilyInvitation} from '@/components/family-invitation';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function FamilyInvitationPage(){return <BrandSurface><FamilyInvitation signedIn={!!await getIdentity()}/></BrandSurface>;}
