import {proposeTimetableCover,timetableCoverContext,timetableCoverInbox} from '@/lib/server/academic-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return new URL(request.url).searchParams.has('occurrenceId')?timetableCoverContext(request):timetableCoverInbox();}
export const POST=proposeTimetableCover;
