import {meetingDetail} from '@/lib/server/meetings-http';
export const GET=(request:Request,{params}:{params:Promise<{id:string}>})=>params.then(({id})=>meetingDetail(request,id));
