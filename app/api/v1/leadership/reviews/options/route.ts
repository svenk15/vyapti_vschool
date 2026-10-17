import {leadershipReviewOptions} from '@/lib/server/reporting-http';
export const dynamic='force-dynamic';
export async function GET(request:Request){return leadershipReviewOptions(request);}
