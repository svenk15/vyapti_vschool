import {downloadDocument} from '@/lib/server/documents-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return downloadDocument(request,(await params).id);}
