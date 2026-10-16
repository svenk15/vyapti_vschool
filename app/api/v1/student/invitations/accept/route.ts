import {acceptStudentPortalInvitation} from '@/lib/server/student-portal-http';
export async function POST(request:Request){return acceptStudentPortalInvitation(request);}
