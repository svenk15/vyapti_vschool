import {peopleAvailability} from '@/lib/server/people-availability-http';
export async function GET(request:Request){return peopleAvailability(request);}
export async function POST(request:Request){return peopleAvailability(request);}
