import {publicLogo} from '@/lib/server/branding-http';
export const dynamic='force-dynamic';
export async function GET(_request:Request,context:{params:Promise<{asset:string;file:string}>}){const p=await context.params,m=/^([a-f0-9]{64})\.png$/.exec(p.file);return m?publicLogo(p.asset,m[1]):new Response(null,{status:404,headers:{'Cache-Control':'no-store'}});}
