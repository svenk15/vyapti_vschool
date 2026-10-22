import {previewAcademicTeacherEligibility} from '@/lib/server/academic-http';
export async function POST(request:Request,{params}:{params:Promise<{employeeId:string}>}){const {employeeId}=await params;return previewAcademicTeacherEligibility(request,employeeId);}
