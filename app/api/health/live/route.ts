export const dynamic = "force-dynamic";
export function GET() { return Response.json({service:"vschool", release:"fresh-0.3.0", alive:true},{headers:{"Cache-Control":"no-store"}}); }
