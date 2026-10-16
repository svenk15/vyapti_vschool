import {publicBrand} from '@/lib/server/branding-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,context:{params:Promise<{slug:string}>}){return publicBrand(request,(await context.params).slug);}
