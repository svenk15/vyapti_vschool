import {submitNoticeProposal} from '@/lib/server/communication-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return submitNoticeProposal(request,(await params).id);}
