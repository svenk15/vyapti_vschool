import {importOptions} from '@/lib/server/import-http';
export const dynamic='force-dynamic';
export async function GET(){return importOptions();}
