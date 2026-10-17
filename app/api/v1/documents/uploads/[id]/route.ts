import {documentUploadStatus} from '@/lib/server/documents-http';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){return documentUploadStatus((await params).id);}
