import {createEmployee,listEmployees} from '@/lib/server/people-http';
export async function GET(request:Request){return listEmployees(request);}
export async function POST(request:Request){return createEmployee(request);}
