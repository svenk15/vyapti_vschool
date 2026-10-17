import {requesterCollection} from '@/lib/server/attendance-correction-requests-http';
export const dynamic='force-dynamic';export const GET=(request:Request)=>requesterCollection(request,'TEACHER');export const POST=GET;
