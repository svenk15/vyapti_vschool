export type StudentProfile = Readonly<{
  studentId: string;
  personId: string;
  version: number;
  admissionNumber: string;
  displayName: string;
  status: "ACTIVE" | "ARCHIVED";
  enrollment: null;
}>;

export type StudentWorkspace = Readonly<{ items: readonly StudentProfile[]; nextCursor: string | null }>;
export type StudentDetail = StudentProfile & Readonly<{ history: readonly [] }>;
export type ExistingPersonChoice = Readonly<{ personId: string; displayName: string }>;
