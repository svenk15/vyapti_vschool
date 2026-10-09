import {archiveStudent} from '@/lib/server/student-http';
export const dynamic='force-dynamic';
export async function POST(request:Request,context:{params:Promise<{id:string}>}){const {id}=await context.params;return archiveStudent(request,id);}
