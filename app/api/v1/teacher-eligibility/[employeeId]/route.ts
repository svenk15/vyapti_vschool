import {setAcademicTeacherEligibility} from '@/lib/server/academic-http';
export async function PUT(request:Request,{params}:{params:Promise<{employeeId:string}>}){const {employeeId}=await params;return setAcademicTeacherEligibility(request,employeeId);}
