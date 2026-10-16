import {getFamilyWorkspace} from '@/lib/server/guardian-http';
export const dynamic='force-dynamic';
export async function GET(){return getFamilyWorkspace();}
