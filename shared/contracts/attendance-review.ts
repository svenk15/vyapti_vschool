export type AttendanceReviewQuery=Readonly<{view:'pending'|'all';offset:number;limit:number}>;
export type AttendanceReviewPage<T>=Readonly<{items:readonly T[];total:number}>;
