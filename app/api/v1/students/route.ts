import { createStudent, listStudents } from "@/lib/server/student-http";
export const dynamic="force-dynamic";
export const GET=listStudents;
export const POST=createStudent;
