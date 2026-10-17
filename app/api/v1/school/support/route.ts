import {mutation} from '@/lib/server/management-http';
export const dynamic='force-dynamic';
export function PUT(request:Request){return mutation(request,'PublishSchoolSupport');}
