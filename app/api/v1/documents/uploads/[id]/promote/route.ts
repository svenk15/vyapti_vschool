import {promoteDocument} from '@/lib/server/documents-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return promoteDocument(request,(await params).id);}
