import {revokeDocumentGrant} from '@/lib/server/documents-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return revokeDocumentGrant(request,(await params).id);}
