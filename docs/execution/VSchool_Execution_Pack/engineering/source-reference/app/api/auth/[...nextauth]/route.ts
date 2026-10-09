import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/server/auth";

export const dynamic="force-dynamic";
const handler=NextAuth(authOptions);
let windowStart=0,attempts=0;
function unavailable(){return Response.json({error:"SERVICE_UNAVAILABLE"},{status:503,headers:{"Cache-Control":"no-store"}});}
function configuredOrigin(){try{return process.env.NEXTAUTH_URL?new URL(process.env.NEXTAUTH_URL).origin:null;}catch{return null;}}
function configured(){return (process.env.NEXTAUTH_SECRET?.length??0)>=32&&!!configuredOrigin();}
export async function GET(request:Request,context:Parameters<typeof handler>[1]) {
 if(!configured())return unavailable();
 try{return await handler(request,context);}catch{return unavailable();}
}
export async function POST(request:Request,context:Parameters<typeof handler>[1]) {
 if(!configured())return unavailable();
 const origin=request.headers.get("origin");
 if(origin!==configuredOrigin())return Response.json({error:"FORBIDDEN"},{status:403});
 const now=Date.now();if(now-windowStart>=60000){windowStart=now;attempts=0;}
 if(++attempts>100)return Response.json({error:"TRY_LATER"},{status:429,headers:{"Retry-After":"60"}});
 if(Number(request.headers.get("content-length"))>8192)return new Response(null,{status:413});
 try{
  const reader=request.body?.getReader(),chunks:Uint8Array[]=[],limit=8192;let length=0;
  if(reader)for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>limit){void reader.cancel();return new Response(null,{status:413});}chunks.push(value);}
  const body=new Uint8Array(length);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.byteLength;}
  return await handler(new NextRequest(request,{body}),context);
 }catch{return unavailable();}
}
