import {academicsWorkspace} from '@/lib/server/academic-http';
export const dynamic='force-dynamic';
export async function GET(){return academicsWorkspace();}
