import { randomBytes,randomUUID } from "node:crypto";
import { writeFileSync,existsSync } from "node:fs";
const path=".env.local";
if(existsSync(path)){console.log("Existing .env.local preserved. Verify NEXTAUTH_SECRET, NEXTAUTH_URL and VSCHOOL_OPERATOR_ID locally.");}
else{writeFileSync(path,`# Local authentication configuration; never commit. Database stays in .env.\nNEXTAUTH_SECRET=${randomBytes(32).toString("hex")}\nNEXTAUTH_URL=http://127.0.0.1:3400\nVSCHOOL_OPERATOR_ID=${randomUUID()}\n`,{flag:"wx",mode:0o600});console.log("Created private authentication-only .env.local; .env was not changed.");}
