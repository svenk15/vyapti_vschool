import {facilitiesStatus} from '@/lib/server/facilities-http';export const GET=(request:Request,{params}:{params:Promise<{key:string}>})=>params.then(({key})=>facilitiesStatus(request,key));
