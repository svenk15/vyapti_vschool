import {retryDocumentScan} from '@/lib/server/documents-http';
export async function POST(_request:Request,{params}:{params:Promise<{id:string}>}){return retryDocumentScan((await params).id);}
