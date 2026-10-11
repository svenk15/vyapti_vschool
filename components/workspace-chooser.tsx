'use client';
import {useRef,useState} from 'react';
import {signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {Button,Stepper} from '@/components/ui/primitives';
import {SelectField} from '@/components/ui/forms';

type BranchOption={institutionId:string;institutionName:string;branchId:string;branchName:string;branchCode:string};

export function WorkspaceChooser({branches}:{branches:BranchOption[]}){
 const router=useRouter();
 const [stage,setStage]=useState<1|2>(1),[selected,setSelected]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const heading=useRef<HTMLHeadingElement>(null),chosen=branches.find(branch=>branch.branchId===selected);
 function move(next:1|2){setStage(next);setError('');requestAnimationFrame(()=>heading.current?.focus());}
 async function confirm(){
  if(!chosen)return;
  setBusy(true);setError('');
  try{
   const response=await fetch('/api/v1/context/switch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({institutionId:chosen.institutionId,branchId:chosen.branchId}),cache:'no-store'});
   if(!response.ok)throw new Error();
   router.replace('/account');router.refresh();
  }catch{setBusy(false);setError('That branch is no longer available. Go back and choose an authorized branch.');requestAnimationFrame(()=>heading.current?.focus());}
 }
 async function backToSignIn(){setBusy(true);setError('');try{await signOut({callbackUrl:'/sign-in'});}catch{setBusy(false);setError('Unable to sign out. Try again.');requestAnimationFrame(()=>heading.current?.focus());}}
 return <div className="workspace-choice-flow">
  <Stepper steps={['School sign-in','Choose your workspace','Confirm']} current={stage}/>
  {stage===1?<section className="workspace-choice-stage">
   <div className="section-header"><div><h3 ref={heading} tabIndex={-1}>Choose your workspace</h3><p className="muted">Only authorized branches appear. This step is skipped when there is only one.</p></div></div>
   <SelectField label="Branch" required value={selected} onChange={event=>{setSelected(event.target.value);setError('');}}>
    <option value="">Choose branch</option>{branches.map(branch=><option key={branch.branchId} value={branch.branchId}>{branch.institutionName} · {branch.branchName}</option>)}
   </SelectField>
   {error&&<p className="field-error" role="alert">{error}</p>}
   <div className="workspace-choice-actions"><Button variant="secondary" disabled={busy} onClick={()=>void backToSignIn()}>← Back</Button><Button disabled={!chosen||busy} onClick={()=>move(2)}>Continue <span aria-hidden="true">→</span></Button></div>
  </section>:<section className="workspace-choice-stage">
   <div className="section-header"><div><h3 ref={heading} tabIndex={-1}>Review and confirm</h3><p className="muted">Check the intended workspace before continuing.</p></div></div>
   <dl className="workspace-choice-review"><div><dt>Institution</dt><dd>{chosen?.institutionName}</dd></div><div><dt>Branch</dt><dd>{chosen?.branchName}</dd></div><div><dt>Expected outcome</dt><dd>The administrator lands on Today in the chosen branch.</dd></div></dl>
   {error&&<p className="field-error" role="alert">{error}</p>}
   <div className="workspace-choice-actions"><Button variant="secondary" disabled={busy} onClick={()=>move(1)}>← Back</Button><Button loading={busy} onClick={()=>void confirm()}>{busy?'Opening workspace…':'Confirm'} <span aria-hidden="true">✓</span></Button></div>
  </section>}
  <div className="workspace-choice-draft"><Button variant="ghost" size="small" disabled>Save draft and leave</Button></div>
 </div>;
}
