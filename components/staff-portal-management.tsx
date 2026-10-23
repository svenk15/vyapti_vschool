'use client';

import {useState} from 'react';
import type {StaffProfileAccess} from '@/shared/contracts/people';
import {StaffInvitationManagement} from '@/components/staff-invitation-management';
import {useCommand} from '@/components/access-management';
import {Checkbox,TextArea} from '@/components/ui/forms';
import {Avatar,Button,ButtonLink} from '@/components/ui/primitives';
import {Dialog} from '@/components/ui/interactive';

const roleLabel={SCHOOL_ADMIN:'School administrator',TEACHER:'Teacher',PRINCIPAL:'Principal'} as const;
type AccessAction='SET_ROLES'|'SUSPEND'|'REINSTATE'|'REVOKE';

export function StaffPortalManagement({employeeId,employeeName,staffNumber,schoolId,access}:{employeeId:string;employeeName:string;staffNumber:string;schoolId:string;access:StaffProfileAccess}){
 const [open,setOpen]=useState(false),[current,setCurrent]=useState(access),[step,setStep]=useState<'summary'|'change'>('summary'),[action,setAction]=useState<AccessAction>('SET_ROLES'),[roles,setRoles]=useState([...access.roles]),[reason,setReason]=useState('');
 async function refresh(){const response=await fetch(`/api/v1/employees/${employeeId}/invitation`,{cache:'no-store'});if(!response.ok)throw new Error('Current staff access could not be loaded.');setCurrent(await response.json());}
 const command=useCommand(refresh,intent=>`/api/v1/memberships/status/${intent.command}/${intent.key}?schoolId=${encodeURIComponent(schoolId)}`),disabled=command.busy||command.uncertain||command.denied;
 const trigger=current.state==='NO_ACCOUNT'?'Set up access':current.state==='PENDING'?'View invitation':'View access';
 const branchState=current.state==='ACTIVE'?'Active':current.state==='SUSPENDED'?'Suspended':current.state==='REVOKED'?'Revoked':current.state==='PENDING'?'Pending':'Linked';
 const actionTitle=action==='SET_ROLES'?'Change roles':action==='SUSPEND'?'Suspend access':action==='REINSTATE'?'Reinstate access':'Revoke access';
 const unchangedRoles=[...roles].sort().join('|')===[...current.roles].sort().join('|');
 function begin(next:AccessAction){command.startNew();setAction(next);setRoles([...current.roles]);setReason('');setStep('change');}
 function close(){if(command.uncertain)return;setOpen(false);setStep('summary');setReason('');}
 function toggle(role:'SCHOOL_ADMIN'|'TEACHER',checked:boolean){setRoles(checked?[...new Set([...roles,role])]:roles.filter(item=>item!==role));}
 async function save(){if(!current.membershipId||current.membershipVersion===null)return;const selectedRoles=action==='SET_ROLES'?roles:undefined,saved=await command.run({url:`/api/v1/memberships/${current.membershipId}?schoolId=${encodeURIComponent(schoolId)}`,method:'PATCH',command:'UpdateMembership',body:{payload:{action,...(selectedRoles?{roles:selectedRoles}:{}),reason},expectedVersion:current.membershipVersion}});if(saved){setStep('summary');setReason('');}}
 return <>
  <Button variant="ghost" size="small" onClick={()=>{setCurrent(access);setStep('summary');setOpen(true);}}>{trigger} <span aria-hidden="true">→</span></Button>
  <Dialog drawer className="staff-reference-drawer staff-portal-drawer" title={step==='summary'?'Staff access':actionTitle} description="Review this staff member’s current account and invitation state." open={open} onClose={close}>
   {step==='summary'?<div className="staff-access-summary staff-profile-access-summary">
    <div className="staff-access-person"><Avatar name={employeeName}/><div><strong>{employeeName}</strong><span>{staffNumber}</span></div></div>
    {current.state==='NO_ACCOUNT'?<><p className="muted small">No sign-in account is linked to this staff record.</p><ButtonLink href={`/admin/users/grant?employeeId=${employeeId}`}>Set up access</ButtonLink></>:<>
     <p className="small muted">Sign-in email</p><p>{current.email}</p>
     <dl className="staff-access-facts"><div><dt>Account</dt><dd><span className={`quiet-status ${current.state==='ACTIVE'?'good':current.state==='PENDING'?'warn':'none'}`}>{current.state==='PENDING'?'Pending activation':current.state==='REVOKED'?'Revoked':'Active'}</span></dd></div><div><dt>Branch access</dt><dd><span className={`quiet-status ${current.state==='ACTIVE'?'good':current.state==='PENDING'||current.state==='SUSPENDED'?'warn':'none'}`}>{branchState}</span></dd></div></dl>
     {current.roles.length>0&&<div className="staff-access-roles"><span className="small muted">Branch roles</span><p>{current.roles.map(role=>roleLabel[role]).join(' · ')}</p></div>}
     <StaffInvitationManagement employeeId={employeeId} initial={current} compact/>
     {current.membershipId&&current.state!=='REVOKED'&&<section className="staff-profile-access-section"><h3>Manage branch access</h3><div className="staff-access-actions staff-profile-access-actions"><button disabled={disabled} onClick={()=>begin('SET_ROLES')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 16 10.5-10.5 4 4L8 20H4v-4Z"/></svg><span><strong>Change roles</strong></span><span aria-hidden="true">→</span></button>{current.state==='SUSPENDED'?<button disabled={disabled} onClick={()=>begin('REINSTATE')}><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg><span><strong>Reinstate access</strong></span><span aria-hidden="true">→</span></button>:<button disabled={disabled} onClick={()=>begin('SUSPEND')}><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg><span><strong>Suspend access</strong></span><span aria-hidden="true">→</span></button>}<button className="dangerlink" disabled={disabled} onClick={()=>begin('REVOKE')}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg><span><strong>Revoke access</strong></span><span aria-hidden="true">→</span></button></div></section>}
    </>}
    <div className="drawer-actions staff-profile-access-footer"><Button variant="secondary" onClick={close}>Close</Button></div>
   </div>:<form className="staff-profile-access-form" onSubmit={event=>{event.preventDefault();void save();}}>
    {command.notice}
    <div className="staff-drawer-person"><Avatar name={employeeName}/><div className="staff-drawer-person-copy"><div className="staff-drawer-person-name">{employeeName}</div><div className="staff-drawer-person-number">{staffNumber}</div></div></div>
    <p className="staff-access-consequence">{action==='SET_ROLES'?'Review the roles this account will have in this branch.':action==='SUSPEND'?'Sign-in to this branch will be blocked. Employment and teaching assignments remain unchanged.':action==='REINSTATE'?(current.state==='ACTIVE'?'Branch access will become active. Employment is unchanged.':'Branch access will remain pending until the account is activated. Employment is unchanged.'):'Branch access will be removed. The Staff record and other branches are unchanged.'}</p>
    {action!=='SET_ROLES'&&<dl className="staff-access-action-facts"><div><dt>Sign-in email</dt><dd>{current.email}</dd></div><div><dt>Current state</dt><dd>{branchState}</dd></div></dl>}
    {action==='SET_ROLES'&&<fieldset><legend>Branch roles</legend>{roles.includes('PRINCIPAL')&&<Checkbox label="Principal" checked disabled/>}<Checkbox label="School administrator" checked={roles.includes('SCHOOL_ADMIN')} disabled={disabled} onChange={event=>toggle('SCHOOL_ADMIN',event.target.checked)}/><Checkbox label="Teacher" checked={roles.includes('TEACHER')} disabled={disabled} onChange={event=>toggle('TEACHER',event.target.checked)}/></fieldset>}
    <TextArea label="Reason" required maxLength={500} value={reason} disabled={disabled} onChange={event=>setReason(event.target.value)}/>
    <div className="drawer-actions"><Button type="button" variant="secondary" disabled={command.busy||command.uncertain} onClick={()=>setStep('summary')}>Back</Button><Button type="submit" loading={command.busy} disabled={disabled||(action==='SET_ROLES'&&(!roles.length||unchangedRoles))||!reason.trim()}>{action==='SET_ROLES'?'Save':actionTitle}</Button></div>
   </form>}
  </Dialog>
 </>;
}
