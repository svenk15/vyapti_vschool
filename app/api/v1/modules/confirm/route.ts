import {confirmModules} from '@/lib/server/tenancy-module-http';
export async function POST(request:Request){return confirmModules(request);}
