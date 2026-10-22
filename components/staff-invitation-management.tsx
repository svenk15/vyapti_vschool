'use client';
import {useState} from 'react';
import type {StaffProfileAccess} from '@/shared/contracts/people';
import {Alert,Badge,Button} from '@/components/ui/primitives';
import {Dialog} from '@/components/ui/interactive';

type Attempt={key:string;invitationId:string;reason:string};
type Result={invitationId:string;deliveryStatus:'PENDING_DELIVERY'|'SENT'|'FAILED';deliveryFailedAt?:string;deliveryFailureReason?:string;replayed:boolean};
const label={PENDING_DELIVERY:'Preparing delivery',SENT:'Invitation sent',FAILED:'Delivery failed',EXPIRED:'Expired',CONSUMED:'Accepted',REVOKED:'Revoked'} as const;
const roleLabel={SCHOOL_ADMIN:'School administrator',TEACHER:'Teacher',PRINCIPAL:'Principal'} as const;
const tone=(state:NonNullable<StaffProfileAccess['invitation']>['state'])=>state==='SENT'||state==='CONSUMED'?'success':state==='FAILED'||state==='EXPIRED'?'warning':'neutral';
async function payload<T>(response:Response):Promise<T>{const value=await response.json().catch(()=>({}));if(!response.ok)throw new Error(typeof value.message==='string'?value.message:'Unable to complete the change.');return value as T;}

export function StaffInvitationManagement({employeeId,initial}:{employeeId:string;initial:StaffProfileAccess}){
 const [access,setAccess]=useState(initial),[open,setOpen]=useState(false),[reason,setReason]=useState(''),[busy,setBusy]=useState(false),[attempt,setAttempt]=useState<Attempt|null>(null),[unknown,setUnknown]=useState(false),[savedRefresh,setSavedRefresh]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 const invitation=access.invitation,canResend=invitation?.state==='FAILED'||invitation?.state==='EXPIRED';
 async function refresh(){setBusy(true);setError('');try{setAccess(await payload<StaffProfileAccess>(await fetch(`/api/v1/employees/${employeeId}/invitation`,{cache:'no-store'})));setSavedRefresh(false);setMessage('Invitation status refreshed.');}catch(cause){setError(cause instanceof Error?cause.message:'Current invitation status is unavailable.');}finally{setBusy(false);}}
 async function submit(existing?:Attempt){const next=existing??{key:crypto.randomUUID(),invitationId:invitation!.id,reason:reason.trim()};setAttempt(next);setBusy(true);setUnknown(false);setSavedRefresh(false);setMessage('');setError('');try{
   const result=await payload<Result>(await fetch(`/api/v1/employees/${employeeId}/invitation`,{method:'POST',headers:{'content-type':'application/json','idempotency-key':next.key},body:JSON.stringify({...next,key:next.key})}));setAttempt(null);setUnknown(false);setMessage(result.deliveryStatus==='SENT'?'Replacement invitation sent.':'Replacement saved; delivery failed.');
   try{setAccess(await payload<StaffProfileAccess>(await fetch(`/api/v1/employees/${employeeId}/invitation`,{cache:'no-store'})));setOpen(false);setReason('');}catch{setSavedRefresh(true);setOpen(false);}
  }catch(cause){setUnknown(true);setError(cause instanceof Error?cause.message:'The invitation outcome is unknown.');}finally{setBusy(false);}}
 function close(){if(unknown){setError('Check the pending invitation before closing.');return;}setOpen(false);setError('');}
 return <div className="staff-invitation-management">
  {message&&<Alert tone="success" title="Invitation updated" onDismiss={()=>setMessage('')}>{message}</Alert>}
  {savedRefresh&&<Alert tone="warning" title="Invitation saved; current status unavailable">The replacement was confirmed. Refreshing checks the current state and will not send another invitation.<span className="alert-actions"><Button size="small" variant="secondary" loading={busy} onClick={()=>void refresh()}>Refresh saved view</Button></span></Alert>}
  <div className="staff-access-summary"><strong>{access.state==='NO_ACCOUNT'?'No account':access.email??'Linked account'}</strong><p className="muted small">Contact email and sign-in access are managed separately.</p>{access.roles.length>0&&<p className="small">{access.roles.map(role=>roleLabel[role]).join(' · ')}</p>}</div>
  {invitation&&<div className="staff-invitation-state"><div><span className="small muted">Invitation</span><p><Badge tone={tone(invitation.state)}>{label[invitation.state]}</Badge></p><p className="small muted">Expires {new Date(invitation.expiresAt).toLocaleString()}</p>{invitation.deliveryFailureReason&&<p className="small">{invitation.deliveryFailureReason}</p>}</div>{canResend&&<Button size="small" variant="secondary" onClick={()=>{setReason('');setError('');setUnknown(false);setAttempt(null);setOpen(true);}}>Review resend</Button>}</div>}
  <Dialog title="Resend staff invitation" description="Review the current failed or expired invitation before creating a replacement." open={open} onClose={close}>
   {error&&<Alert tone="danger" title={unknown?'Outcome not confirmed':'Invitation not resent'}>{error}{unknown&&attempt&&<span className="alert-actions"><Button size="small" variant="secondary" loading={busy} onClick={()=>void submit(attempt)}>Retry unchanged resend</Button></span>}</Alert>}
   <dl className="workspace-choice-review"><div><dt>Staff account</dt><dd>{access.email}</dd></div><div><dt>Current state</dt><dd>{invitation?label[invitation.state]:'No invitation'}</dd></div></dl>
   <label className="field"><span>Reason</span><textarea rows={4} minLength={10} maxLength={500} disabled={busy||unknown} value={reason} onChange={event=>setReason(event.target.value)} placeholder="Why is a replacement invitation needed?"/></label>
   <p className="small muted">The existing invitation will stop working. Access roles and teaching eligibility will not change.</p>
   <div className="form-actions dialog-actions"><Button variant="secondary" disabled={busy} onClick={close}>Cancel</Button><Button loading={busy} disabled={unknown||reason.trim().length<10||!canResend} onClick={()=>void submit()}>Resend invitation</Button></div>
  </Dialog>
 </div>;
}
