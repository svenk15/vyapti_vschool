import {getFamilyAttendance} from '@/lib/server/guardian-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return getFamilyAttendance(request);}
