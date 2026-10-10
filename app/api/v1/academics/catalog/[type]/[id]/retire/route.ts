import {retireAcademicCatalogItem} from '@/lib/server/academic-http';
export async function POST(request:Request,context:{params:Promise<{type:string;id:string}>}){const {type,id}=await context.params;return retireAcademicCatalogItem(request,type,id);}
