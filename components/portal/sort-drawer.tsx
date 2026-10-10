'use client';
import {useState} from 'react';
import {Dialog} from '@/components/ui/interactive';
import {Button} from '@/components/ui/primitives';
import {RadioGroup} from '@/components/ui/forms';

export type SortSelection=Readonly<{by:string;order:'ascending'|'descending'}>;

export function SortDrawer({open,onClose,options,applied,onApply}:{open:boolean;onClose:()=>void;options:readonly Readonly<{value:string;label:string}>[];applied:SortSelection;onApply:(selection:SortSelection)=>void}){
 const [draft,setDraft]=useState<SortSelection>(applied);
 const close=()=>{setDraft(applied);onClose();};
 return <Dialog open={open} onClose={close} title="Sort" description="Choose how this list is ordered. Changes apply only after you confirm." drawer>
  <div className="drawer-attributes">
   <details className="drawer-attribute" open><summary>Sort by</summary><RadioGroup label="Sort by" name="sort-by" options={[...options]} value={draft.by} onChange={by=>setDraft(current=>({...current,by}))}/></details>
   <details className="drawer-attribute" open><summary>Order by</summary><RadioGroup label="Order by" name="sort-order" options={[{value:'ascending',label:'Ascending'},{value:'descending',label:'Descending'}]} value={draft.order} onChange={order=>setDraft(current=>({...current,order:order as SortSelection['order']}))}/></details>
  </div>
  <div className="dialog-actions drawer-footer"><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={()=>{onApply(draft);onClose();}}>Apply</Button></div>
 </Dialog>;
}
