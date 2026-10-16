import {capabilityInterests,submitCapabilityInterest} from '@/lib/server/tenancy-module-http';
export async function GET(){return capabilityInterests();}
export async function POST(request:Request){return submitCapabilityInterest(request);}
