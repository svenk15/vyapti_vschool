import {publishLearningFeedback} from '@/lib/server/learning-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string;submissionId:string}>}){const {id,submissionId}=await params;return publishLearningFeedback(request,id,submissionId);}
