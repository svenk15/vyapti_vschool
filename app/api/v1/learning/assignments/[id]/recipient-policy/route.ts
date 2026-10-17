import {applyLearningRecipientPolicy} from '@/lib/server/learning-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return applyLearningRecipientPolicy(request,(await params).id);}
