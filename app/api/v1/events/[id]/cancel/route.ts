import {cancelEvent} from '@/lib/server/events-http';
export const POST=(request:Request,{params}:{params:Promise<{id:string}>})=>params.then(({id})=>cancelEvent(request,id));
