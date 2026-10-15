import {publishLearningAssignment} from '@/lib/server/learning-http';
export const POST=(request:Request,{params}:{params:Promise<{id:string}>})=>params.then(({id})=>publishLearningAssignment(request,id));
