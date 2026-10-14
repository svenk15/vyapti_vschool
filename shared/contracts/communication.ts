export type NoticeSummary=Readonly<{noticeId:string;versionId:string;version:number;title:string;publishedAt:string;requiresAcknowledgement:boolean;readAt:string|null;acknowledgedAt:string|null;childNames:readonly string[]}>;
export type NoticeDetail=NoticeSummary&Readonly<{body:string;schoolName:string}>;
export type AdminNoticeSummary=Readonly<{noticeId:string;versionId:string;version:number;title:string;audienceLabel:string;publishedAt:string;recipientCount:number;readCount:number;acknowledgedCount:number;requiresAcknowledgement:boolean}>;
export type NoticePublicationResult=Readonly<{noticeId:string;versionId:string;version:number;recipientCount:number;replayed:boolean}>;
export type NoticeAcknowledgementResult=Readonly<{noticeId:string;versionId:string;acknowledgedAt:string;replayed:boolean}>;
