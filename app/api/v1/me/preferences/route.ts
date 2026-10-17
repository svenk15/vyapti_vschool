import {getPreferences,putPreferences} from '@/lib/server/preferences-http';
export const dynamic='force-dynamic';
export function GET(){return getPreferences();}
export function PUT(request:Request){return putPreferences(request);}
