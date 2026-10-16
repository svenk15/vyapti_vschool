import {coordinationSourceAssignees} from '@/lib/server/coordination-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return coordinationSourceAssignees(request);}
