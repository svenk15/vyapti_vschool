import {submitLearningStudentWork} from '@/lib/server/learning-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return submitLearningStudentWork(request,(await params).id);}
