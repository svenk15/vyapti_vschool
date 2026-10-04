import "server-only";
import {join} from "node:path";
import {DevelopmentMailSink} from "../../backend/modules/access/infrastructure/development-mail-sink";
import type {AccessEmailSender} from "../../backend/modules/access/application/password-reset";

const unavailable:AccessEmailSender={sendPasswordReset:async()=>({ok:false,reason:"Email delivery is not configured"}),sendStaffInvite:async()=>({ok:false,reason:"Email delivery is not configured"})};
const configuredOrigin=process.env.NEXTAUTH_URL;
export const emailSender:AccessEmailSender=configuredOrigin
 ?new DevelopmentMailSink(new URL(configuredOrigin).origin,join(process.cwd(),"artifacts/mail-sink"),process.env.NODE_ENV==="development")
 :unavailable;
