import {proposeMeeting} from '@/lib/server/meetings-http';
export const POST=(request:Request,{params}:{params:Promise<{id:string}>})=>params.then(({id})=>proposeMeeting(request,id));
