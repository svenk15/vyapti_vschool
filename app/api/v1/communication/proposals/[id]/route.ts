import {authorNoticeProposalDetail,saveNoticeProposal} from '@/lib/server/communication-http';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){return authorNoticeProposalDetail((await params).id);}
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){return saveNoticeProposal(request,(await params).id);}
