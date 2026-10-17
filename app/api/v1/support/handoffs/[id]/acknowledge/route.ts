import {acknowledgeHandoff} from '@/lib/server/support-http';export const POST=(request:Request,{params}:{params:Promise<{id:string}>})=>params.then(({id})=>acknowledgeHandoff(request,id));
