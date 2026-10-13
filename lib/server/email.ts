import "server-only";
import {join} from "node:path";
import {DevelopmentMailSink} from "../../backend/modules/access/infrastructure/development-mail-sink";
import type {AccessEmailSender} from "../../backend/modules/access/application/password-reset";

const unavailable:AccessEmailSender={sendPasswordReset:async()=>({ok:false,reason:"Email delivery is not configured"}),sendStaffInvite:async()=>({ok:false,reason:"Email delivery is not configured"}),sendFamilyInvite:async()=>({ok:false,reason:"Email delivery is not configured"})};
const configuredOrigin=process.env.NEXTAUTH_URL;
function localEndToEndMailSink(){
 if(process.env.VSCHOOL_E2E!=="1")return false;
 try{
  const database=new URL(process.env.DATABASE_URL??""),origin=new URL(configuredOrigin??"");
  return database.pathname==="/vyapti_vschool_test"&&["localhost","127.0.0.1","[::1]"].includes(database.hostname)&&origin.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(origin.hostname);
 }catch{return false;}
}
function localDemoMailSink(){
 if(process.env.VSCHOOL_LOCAL_DEMO!=="1")return false;
 try{
  const database=new URL(process.env.DATABASE_URL??""),origin=new URL(configuredOrigin??"");
  return database.pathname==="/vyapti_vschool"&&["localhost","127.0.0.1","[::1]"].includes(database.hostname)&&origin.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(origin.hostname);
 }catch{return false;}
}
export const emailSender:AccessEmailSender=configuredOrigin
 ?new DevelopmentMailSink(new URL(configuredOrigin).origin,join(process.cwd(),"artifacts/mail-sink"),process.env.NODE_ENV==="development"||localEndToEndMailSink()||localDemoMailSink())
 :unavailable;
