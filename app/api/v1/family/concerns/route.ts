import {familyRequestsCollection} from '@/lib/server/requests-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return familyRequestsCollection(request);}
export async function POST(request:Request){return familyRequestsCollection(request);}
