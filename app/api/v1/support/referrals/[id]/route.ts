import {referralItem} from '@/lib/server/support-http';export const GET=(request:Request,{params}:{params:Promise<{id:string}>})=>params.then(({id})=>referralItem(request,id));export const POST=GET;
