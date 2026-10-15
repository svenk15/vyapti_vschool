import {getLearningTeacherFeedback,saveLearningFeedbackDraft} from '@/lib/server/learning-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string;submissionId:string}>}){const {id,submissionId}=await params;return getLearningTeacherFeedback(request,id,submissionId);}
export async function PUT(request:Request,{params}:{params:Promise<{id:string;submissionId:string}>}){const {id,submissionId}=await params;return saveLearningFeedbackDraft(request,id,submissionId);}
