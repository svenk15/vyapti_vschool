import "server-only";
import type { NextAuthOptions } from "next-auth";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Credentials from "next-auth/providers/credentials";
import { access } from "./access";
import type { CurrentSessionInfo, Identity } from "../../shared/contracts/access";

export const authOptions:NextAuthOptions = {
 secret:process.env.NEXTAUTH_SECRET,
 session:{strategy:"jwt",maxAge:8*60*60},
 jwt:{maxAge:8*60*60},
 pages:{signIn:"/sign-in",error:"/sign-in"},
 providers:[Credentials({name:"School account",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(credentials){
  const identity=await access.authenticate(credentials?.email,credentials?.password);
  return identity?{id:identity.accountId,...identity}:null;
 }})],
 callbacks:{
  async jwt({token,user}){
   if(user){token.accountId=user.accountId;token.tokenVersion=user.tokenVersion;return token;}
   if(typeof token.accountId==="string"&&typeof token.tokenVersion==="number"){
    try{if(!await access.isCurrentIdentity({accountId:token.accountId,tokenVersion:token.tokenVersion}))throw new Error("STALE_IDENTITY");}
    catch{throw new Error("STALE_IDENTITY");}
   }
   return token;
  },
  async session({session,token}){
   const identity=typeof token.accountId==="string"&&typeof token.tokenVersion==="number"?{accountId:token.accountId,tokenVersion:token.tokenVersion}:null;
   session.identity=identity&&await access.isCurrentIdentity(identity)?identity:null;
   delete session.user;
   return session;
  },
  async redirect({url,baseUrl}){
   try {const target=new URL(url,baseUrl);if(target.origin===new URL(baseUrl).origin&&["/admin","/account","/sign-in","/family","/student","/choose-workspace"].includes(target.pathname))return target.href;}catch{}
   return new URL("/admin",baseUrl).href;
  },
 },
 logger:{error(){console.error("AUTH_SERVICE_ERROR");},warn(){},debug(){}},
};
export async function getIdentity():Promise<Identity|null> {
 if((process.env.NEXTAUTH_SECRET?.length??0)<32||!process.env.NEXTAUTH_URL) return null;
 // Decode provider-issued identity only. Current authorization remains in the
 // application so a storage outage becomes 503, not a misleading logout.
 const request=new NextRequest(new URL("/",process.env.NEXTAUTH_URL),{headers:await headers()});
 const token=await getToken({req:request,secret:process.env.NEXTAUTH_SECRET});
 return typeof token?.accountId==="string"&&typeof token.tokenVersion==="number"?{accountId:token.accountId,tokenVersion:token.tokenVersion}:null;
}
export async function getCurrentSessionInfo():Promise<CurrentSessionInfo|null>{
 if((process.env.NEXTAUTH_SECRET?.length??0)<32||!process.env.NEXTAUTH_URL)return null;
 const request=new NextRequest(new URL('/',process.env.NEXTAUTH_URL),{headers:await headers()}),token=await getToken({req:request,secret:process.env.NEXTAUTH_SECRET});
 return typeof token?.iat==='number'&&typeof token.exp==='number'?{startedAt:new Date(token.iat*1000).toISOString(),expiresAt:new Date(token.exp*1000).toISOString()}:null;
}
