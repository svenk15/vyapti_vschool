import {createPupilReviewSnapshot} from '@/lib/server/attendance-pupil-http';
export const dynamic='force-dynamic';
export async function POST(request:Request){return createPupilReviewSnapshot(request);}
