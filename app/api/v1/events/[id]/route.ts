import {updateEvent} from '@/lib/server/events-http';
export const PATCH=(request:Request,{params}:{params:Promise<{id:string}>})=>params.then(({id})=>updateEvent(request,id));
