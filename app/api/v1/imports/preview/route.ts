import {previewImport} from '@/lib/server/import-http';
export const dynamic='force-dynamic';
export async function POST(request:Request){return previewImport(request);}
