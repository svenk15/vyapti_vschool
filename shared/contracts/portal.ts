export type PortalIdentity = Readonly<{
  displayName: string;
  roleLabel: string;
  institutionName: string;
  branchName: string;
}>;

export type PortalLink = Readonly<{id:string;label:string;href:string;icon:string}>;
export type PortalGroup = Readonly<{id:string;label:string;items:readonly PortalLink[]}>;
export type PortalView = Readonly<{identity:PortalIdentity;groups:readonly PortalGroup[]}>;

export type CommandFeedbackState =
  | Readonly<{kind:'idle'}>
  | Readonly<{kind:'submitting';commandKey:string}>
  | Readonly<{kind:'confirmed';commandKey:string;receiptId?:string}>
  | Readonly<{kind:'unknown';commandKey:string}>
  | Readonly<{kind:'conflict'|'denied';message:string}>
  | Readonly<{kind:'invalid';fields:Readonly<Record<string,string>>}>;
