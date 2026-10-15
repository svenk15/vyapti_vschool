import {saveLearningStudentDraft} from '@/lib/server/learning-http';
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){return saveLearningStudentDraft(request,(await params).id);}
