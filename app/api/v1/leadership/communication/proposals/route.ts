import {listReviewNoticeProposals} from '@/lib/server/communication-http';
export const dynamic='force-dynamic';
export async function GET(){return listReviewNoticeProposals();}
