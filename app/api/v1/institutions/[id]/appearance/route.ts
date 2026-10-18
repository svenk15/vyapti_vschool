import {institutionAppearance,updateInstitutionAppearance} from '@/lib/server/appearance-http';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return institutionAppearance(request,(await params).id);}
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){return updateInstitutionAppearance(request,(await params).id);}
