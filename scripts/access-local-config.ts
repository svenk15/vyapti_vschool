import { config } from "dotenv";
import { uuidPattern } from "../backend/modules/access/domain/policy";
config({path:".env.local",quiet:true});config({quiet:true});
export function localAccessConfig(){
 const databaseUrl=process.env.DATABASE_URL??"",operatorId=process.env.VSCHOOL_OPERATOR_ID??"";
 const url=new URL(databaseUrl);
 if(!["postgres:","postgresql:"].includes(url.protocol)||!["localhost","127.0.0.1","[::1]"].includes(url.hostname)||url.pathname!=="/vyapti_vschool"||url.search||!uuidPattern.test(operatorId))throw new Error("LOCAL_CONFIGURATION_REQUIRED");
 return {databaseUrl,operator:{operatorId,verified:true as const}};
}
