import {getStudentPortalWorkspace} from '@/lib/server/student-portal-http';
export const dynamic='force-dynamic';
export async function GET(){return getStudentPortalWorkspace();}
