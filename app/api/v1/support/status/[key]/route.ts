import {supportStatus} from '@/lib/server/support-http';export const GET=(request:Request,{params}:{params:Promise<{key:string}>})=>params.then(({key})=>supportStatus(request,key));
