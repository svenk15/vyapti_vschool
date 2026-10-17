import {sendAcknowledgementReminder} from '@/lib/server/communication-http';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return sendAcknowledgementReminder(request,(await params).id);}
