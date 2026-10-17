import {meetingCommand} from '@/lib/server/meetings-http';
export const POST=(request:Request,{params}:{params:Promise<{id:string;action:string}>})=>params.then(({id,action})=>meetingCommand(request,id,action));
