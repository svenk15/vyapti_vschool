import {updateLearningDraft} from '@/lib/server/learning-http';
export const PATCH=(request:Request,{params}:{params:Promise<{id:string}>})=>params.then(({id})=>updateLearningDraft(request,id));
