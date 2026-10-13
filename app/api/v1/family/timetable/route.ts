import {getFamilyTimetable} from '@/lib/server/guardian-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return getFamilyTimetable(request);}
