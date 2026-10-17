import {uploadDocument} from '@/lib/server/documents-http';
export const dynamic='force-dynamic';
export async function POST(request:Request){return uploadDocument(request);}
