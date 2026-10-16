export type TeacherRosterStudent=Readonly<{studentId:string;displayName:string;schoolReference:string;rollNumber:string|null}>;
export type TeacherAssignedClass=Readonly<{offeringId:string;sectionId:string;className:string;subjectName:string;academicYearName:string;assignmentFrom:string;assignmentTo:string;pupilCount:number}>;
export type TeacherClassWorkspace=Readonly<{date:string;timezone:string;classes:readonly TeacherAssignedClass[];selected:(TeacherAssignedClass&{roster:readonly TeacherRosterStudent[]})|null}>;
