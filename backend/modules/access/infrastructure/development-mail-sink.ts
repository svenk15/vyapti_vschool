import {mkdir,writeFile} from "node:fs/promises";
import {join} from "node:path";
import {randomUUID} from "node:crypto";
import type {AccessEmailSender} from "../application/password-reset";

/** Local-only delivery adapter. It never opens a network connection. Token-bearing
 * messages are stored only in private, ignored artifacts for manual development demos. */
export class DevelopmentMailSink implements AccessEmailSender{
 constructor(private readonly origin:string,private readonly directory:string,private readonly enabled:boolean){
  const parsed=new URL(origin);if(!["http:","https:"].includes(parsed.protocol))throw new Error("Invalid trusted email origin");
 }
 private async deliver(input:{to:string;subject:string;link:string;expiresAt:string}){
  if(!this.enabled)return {ok:false as const,reason:"Development mail sink is disabled"};
  if(input.to.toLowerCase().endsWith("@mail-fail.vschool.example"))return {ok:false as const,reason:"Mail provider rejected the message"};
  try{
   await mkdir(this.directory,{recursive:true,mode:0o700});
   const id=randomUUID(),path=join(this.directory,`${id}.json`);
   const payload=JSON.stringify({id,createdAt:new Date().toISOString(),recipient:input.to,subject:input.subject,expiresAt:input.expiresAt,link:input.link},null,2)+"\n";
   await writeFile(path,payload,{flag:"wx",mode:0o600});
   return {ok:true as const};
  }catch(error){
   if(error&&typeof error==="object"&&"code" in error)return {ok:false as const,reason:"Development mail sink unavailable"};
   throw error;
  }
 }
 async sendPasswordReset(input:{to:string;token:string;expiresAt:string}){
  const link=new URL("/reset-password",this.origin);link.hash=input.token;
  return this.deliver({to:input.to,subject:"Reset your VSchool password",expiresAt:input.expiresAt,link:link.toString()});
 }
 async sendStaffInvite(input:{to:string;token:string;expiresAt:string;organizationId:string;schoolId:string}){
  const link=new URL("/invite",this.origin);link.hash=input.token;
  return this.deliver({to:input.to,subject:"You are invited to VSchool",expiresAt:input.expiresAt,link:link.toString()});
 }
 async sendFamilyInvite(input:{to:string;token:string;expiresAt:string;organizationId:string;schoolId:string}){
  const link=new URL("/family/invite",this.origin);link.hash=input.token;
  return this.deliver({to:input.to,subject:"Set up your VSchool Parent access",expiresAt:input.expiresAt,link:link.toString()});
 }
 async sendStudentInvite(input:{to:string;token:string;expiresAt:string;organizationId:string;schoolId:string}){
  const link=new URL('/student/invite',this.origin);link.hash=input.token;
  return this.deliver({to:input.to,subject:'Set up your VSchool Student access',expiresAt:input.expiresAt,link:link.toString()});
 }
}
