import "server-only";
import type { NextAuthOptions } from "next-auth";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Credentials from "next-auth/providers/credentials";
import { access } from "./access";
import type { CurrentSessionInfo, Identity } from "../../shared/contracts/access";
const sessionLifetimeSeconds=8*60*60;
function safeSessionLabel(userAgent:unknown):'DESKTOP_WEB'|'MOBILE_WEB'{return typeof userAgent==='string'&&/(android|iphone|ipad|ipod|mobile)/i.test(userAgent)?'MOBILE_WEB':'DESKTOP_WEB';}

export const authOptions:NextAuthOptions = {
 secret:process.env.NEXTAUTH_SECRET,
 session:{strategy:"jwt",maxAge:sessionLifetimeSeconds},
 jwt:{maxAge:sessionLifetimeSeconds},
 pages:{signIn:"/sign-in",error:"/sign-in"},
 providers:[Credentials({name:"School account",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(credentials,request){
  const identity=await access.authenticate(credentials?.email,credentials?.password);
  if(!identity)return null;
  const {sessionId}=await access.startSession(identity,safeSessionLabel(request.headers?.['user-agent']),new Date(Date.now()+sessionLifetimeSeconds*1000));
  return {id:identity.accountId,...identity,sessionId};
 }})],
 callbacks:{
  async jwt({token,user}){
   if(user){token.accountId=user.accountId;token.tokenVersion=user.tokenVersion;token.sessionId=user.sessionId;return token;}
   if(typeof token.accountId==="string"&&typeof token.tokenVersion==="number"&&typeof token.sessionId==='string'){
    try{if(!await access.isCurrentSession({accountId:token.accountId,tokenVersion:token.tokenVersion},token.sessionId))throw new Error("STALE_IDENTITY");}
    catch{throw new Error("STALE_IDENTITY");}
   }else throw new Error('STALE_IDENTITY');
   return token;
  },
  async session({session,token}){
   const identity=typeof token.accountId==="string"&&typeof token.tokenVersion==="number"?{accountId:token.accountId,tokenVersion:token.tokenVersion}:null;
   session.identity=identity&&typeof token.sessionId==='string'&&await access.isCurrentSession(identity,token.sessionId)?identity:null;
   delete session.user;
   return session;
  },
  async redirect({url,baseUrl}){
   try {const target=new URL(url,baseUrl);if(target.origin===new URL(baseUrl).origin&&["/admin","/account","/sign-in","/family","/student","/choose-workspace"].includes(target.pathname))return target.href;}catch{}
   return new URL("/admin",baseUrl).href;
  },
 },
 events:{async signOut({token}){if(typeof token.accountId==='string'&&typeof token.tokenVersion==='number'&&typeof token.sessionId==='string'){await access.revokeSession({accountId:token.accountId,tokenVersion:token.tokenVersion},token.sessionId,token.sessionId);}}},
 logger:{error(){console.error("AUTH_SERVICE_ERROR");},warn(){},debug(){}},
};
export async function getSessionPrincipal():Promise<{identity:Identity;sessionId:string}|null>{
 if((process.env.NEXTAUTH_SECRET?.length??0)<32||!process.env.NEXTAUTH_URL) return null;
 const request=new NextRequest(new URL("/",process.env.NEXTAUTH_URL),{headers:await headers()});
 const token=await getToken({req:request,secret:process.env.NEXTAUTH_SECRET});
 if(typeof token?.accountId!=="string"||typeof token.tokenVersion!=="number"||typeof token.sessionId!=='string')return null;
 const identity={accountId:token.accountId,tokenVersion:token.tokenVersion};
 return await access.isCurrentSession(identity,token.sessionId)?{identity,sessionId:token.sessionId}:null;
}
export async function getIdentity():Promise<Identity|null> {return (await getSessionPrincipal())?.identity??null;}
export async function getCurrentSessionInfo():Promise<CurrentSessionInfo|null>{
 if((process.env.NEXTAUTH_SECRET?.length??0)<32||!process.env.NEXTAUTH_URL)return null;
 const request=new NextRequest(new URL('/',process.env.NEXTAUTH_URL),{headers:await headers()}),token=await getToken({req:request,secret:process.env.NEXTAUTH_SECRET});
 return typeof token?.iat==='number'&&typeof token.exp==='number'?{startedAt:new Date(token.iat*1000).toISOString(),expiresAt:new Date(token.exp*1000).toISOString()}:null;
}
