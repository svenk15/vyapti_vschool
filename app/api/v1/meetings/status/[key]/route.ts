import {meetingStatus} from '@/lib/server/meetings-http';
export const GET=(request:Request,{params}:{params:Promise<{key:string}>})=>params.then(({key})=>meetingStatus(request,key));
