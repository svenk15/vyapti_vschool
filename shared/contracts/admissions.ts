export type AdmissionCycleOption=Readonly<{id:string;code:string;name:string;opensOn:string;closesOn:string}>;
export type AdmissionGradeOption=Readonly<{id:string;code:string;name:string}>;
export type AdmissionContext=Readonly<{cycles:readonly AdmissionCycleOption[];grades:readonly AdmissionGradeOption[]}>;
export type StartAdmissionApplication=Readonly<{applicantName:string;contactEmail:string;gradeId:string;cycleId:string;noticeProvided:true;key:string}>;
export type AdmissionApplicationResult=Readonly<{applicationId:string;reference:string;state:'STARTED';version:number;nextAction:'Checklist review';replayed:boolean}>;
