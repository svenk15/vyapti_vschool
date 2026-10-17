import {reviewNoticeProposalDetail} from '@/lib/server/communication-http';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){return reviewNoticeProposalDetail((await params).id);}
