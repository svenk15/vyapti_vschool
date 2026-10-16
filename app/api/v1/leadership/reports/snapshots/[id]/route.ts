import {leadershipSnapshot} from '@/lib/server/reporting-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,context:RouteContext<'/api/v1/leadership/reports/snapshots/[id]'>){return leadershipSnapshot(request,(await context.params).id);}
export async function DELETE(request:Request,context:RouteContext<'/api/v1/leadership/reports/snapshots/[id]'>){return leadershipSnapshot(request,(await context.params).id);}
