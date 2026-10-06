import type { NextConfig } from "next";
const config: NextConfig = { output: process.env.VSCHOOL_E2E === "1" ? undefined : "standalone", distDir: process.env.VSCHOOL_E2E === "1" ? ".next-e2e" : ".next", devIndicators: false,
 async headers(){return [
  {source:"/forgot-password",headers:[{key:"Cache-Control",value:"no-store"},{key:"Referrer-Policy",value:"no-referrer"}]},
  {source:"/reset-password",headers:[{key:"Cache-Control",value:"no-store"},{key:"Referrer-Policy",value:"no-referrer"}]},
  {source:"/invite",headers:[{key:"Cache-Control",value:"no-store"},{key:"Referrer-Policy",value:"no-referrer"}]}
 ];}
};
export default config;
