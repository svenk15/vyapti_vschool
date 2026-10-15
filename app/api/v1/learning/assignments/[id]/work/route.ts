import {getLearningStudentWork} from '@/lib/server/learning-http';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return getLearningStudentWork(request,(await params).id);}
