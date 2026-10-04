import {currentModuleConfiguration,previewModules} from '@/lib/server/tenancy-module-http';
export async function GET(){return currentModuleConfiguration();}
export async function POST(request:Request){return previewModules(request);}
