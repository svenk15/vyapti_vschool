'use client';
import {useState} from 'react';
import {Dialog} from '@/components/ui/interactive';
import {Button} from '@/components/ui/primitives';

export type FilterSelection=Readonly<Record<string,readonly string[]>>;
export type FilterAttribute=Readonly<{id:string;label:string;mode?:'single'|'multiple';options:readonly Readonly<{value:string;label:string}>[]}>;

const copied=(selection:FilterSelection):Record<string,string[]>=>Object.fromEntries(Object.entries(selection).map(([key,values])=>[key,[...values]]));

export function FilterDrawer({open,onClose,attributes,applied,onApply,title='Filters',description='Choose the records to include. Changes apply only after you confirm.'}:{open:boolean;onClose:()=>void;attributes:readonly FilterAttribute[];applied:FilterSelection;onApply:(selection:FilterSelection)=>void;title?:string;description?:string}){
 const [draft,setDraft]=useState<Record<string,string[]>>(()=>copied(applied));
 const close=()=>{setDraft(copied(applied));onClose();};
 const toggle=(attribute:FilterAttribute,value:string,checked:boolean)=>setDraft(current=>({...current,[attribute.id]:attribute.mode==='single'?(checked?[value]:[]):checked?[...new Set([...(current[attribute.id]??[]),value])]:(current[attribute.id]??[]).filter(item=>item!==value)}));
 return <Dialog open={open} onClose={close} title={title} description={description} drawer>
  <div className="drawer-attributes">
   {attributes.map(attribute=><details className="drawer-attribute" open key={attribute.id}><summary>{attribute.label}</summary><div className="drawer-options">{attribute.options.map(option=>{const selected=(draft[attribute.id]??[]).includes(option.value);return <label className="check-control" key={option.value}><input type={attribute.mode==='single'?'radio':'checkbox'} name={attribute.mode==='single'?`filter-${attribute.id}`:undefined} checked={selected} onChange={event=>toggle(attribute,option.value,event.target.checked)}/><span>{option.label}</span></label>;})}</div></details>)}
  </div>
  <div className="dialog-actions drawer-footer" style={{flexDirection:'row'}}><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={()=>{onApply(copied(draft));onClose();}}>Apply filters</Button></div>
 </Dialog>;
}
