export const activityCategories=["SCHOOL_SETTINGS","STAFF_ACCESS","STUDENT_CHANGE","ATTENDANCE_CORRECTION"] as const;
export type ActivityCategory=(typeof activityCategories)[number];
export type ActivityItem=Readonly<{eventId:string;category:ActivityCategory;action:string;resourceType:string;supportReference:string;occurredAt:string}>;
export type ActivityPage=Readonly<{items:readonly ActivityItem[];nextCursor:string|null}>;
export type ActivityChange=Readonly<{label:"Status"|"Version";before:string|null;after:string|null}>;
export type ActivityDetail=ActivityItem&Readonly<{actorLabel:"School administrator";changes:readonly ActivityChange[]}>;
