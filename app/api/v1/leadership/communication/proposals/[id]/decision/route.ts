import {decideNoticeProposal} from '@/lib/server/communication-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return decideNoticeProposal(request,(await params).id);}
