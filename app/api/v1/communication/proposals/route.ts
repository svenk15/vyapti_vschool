import {listAuthorNoticeProposals,saveNoticeProposal} from '@/lib/server/communication-http';
export const dynamic='force-dynamic';
export async function GET(){return listAuthorNoticeProposals();}
export async function POST(request:Request){return saveNoticeProposal(request,null);}
