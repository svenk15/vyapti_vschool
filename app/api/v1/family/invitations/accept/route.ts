import {acceptFamilyInvitation} from '@/lib/server/guardian-http';
export const dynamic='force-dynamic';
export async function POST(request:Request){return acceptFamilyInvitation(request);}
