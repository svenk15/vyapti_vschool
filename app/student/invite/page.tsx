import {BrandSurface} from '@/components/ui/primitives';
import {StudentPortalInvitation} from '@/components/student-portal-invitation';
import {getIdentity} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export default async function StudentInvitationPage(){return <BrandSurface><StudentPortalInvitation signedIn={!!await getIdentity()}/></BrandSurface>;}
