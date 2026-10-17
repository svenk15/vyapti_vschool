import {requestsCollection} from '@/lib/server/requests-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return requestsCollection(request);}
export async function POST(request:Request){return requestsCollection(request);}
