import {academicOfferings,createCourseOffering} from '@/lib/server/academic-http';
export async function GET(request:Request){return academicOfferings(request);}
export async function POST(request:Request){return createCourseOffering(request);}
