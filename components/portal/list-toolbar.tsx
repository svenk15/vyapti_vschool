'use client';
import {useId,type KeyboardEvent} from 'react';
import {Button} from '@/components/ui/primitives';

export type SearchAttribute=Readonly<{value:string;label:string;placeholder?:string}>;

export function ListToolbar({attributes,selectedAttribute,draftText,appliedSearch,onAttributeChange,onDraftTextChange,onCommitSearch,filterCount=0,onOpenFilters,sortSummary,onOpenSort,busy=false,inputLabel='Search records',maximumLength=100}:{attributes:readonly SearchAttribute[];selectedAttribute:string;draftText:string;appliedSearch:string;onAttributeChange:(value:string)=>void;onDraftTextChange:(value:string)=>void;onCommitSearch:(value:string)=>void;filterCount?:number;onOpenFilters?:()=>void;sortSummary?:string;onOpenSort?:()=>void;busy?:boolean;inputLabel?:string;maximumLength?:number}){
 const id=useId(),attributeId=`${id}-attribute`,inputId=`${id}-input`;
 const commit=()=>onCommitSearch(draftText.normalize('NFC').trim().slice(0,maximumLength));
 const keyDown=(event:KeyboardEvent<HTMLInputElement>)=>{if(event.key==='Enter'){event.preventDefault();commit();}};
 const clear=()=>{onDraftTextChange('');onCommitSearch('');};
 return <div className="list-toolbar" role="search" aria-label="List search and controls">
  <div className="list-search-composition">
   <label className="sr-only" htmlFor={attributeId}>Search by</label>
   <select id={attributeId} aria-label="Search by" value={selectedAttribute} onChange={event=>onAttributeChange(event.target.value)} disabled={busy}>{attributes.map(attribute=><option key={attribute.value} value={attribute.value}>{attribute.label}</option>)}</select>
   <label className="sr-only" htmlFor={inputId}>{inputLabel}</label>
   <input id={inputId} type="search" aria-label={inputLabel} maxLength={maximumLength} value={draftText} placeholder={attributes.find(attribute=>attribute.value===selectedAttribute)?.placeholder} onChange={event=>onDraftTextChange(event.target.value)} onKeyDown={keyDown} disabled={busy}/>
   {(draftText||appliedSearch)&&<Button size="small" variant="ghost" onClick={clear} disabled={busy} aria-label={`Clear ${inputLabel.toLowerCase()}`}>Clear</Button>}
  </div>
  <div className="list-toolbar-actions">
   {onOpenFilters&&<Button variant="secondary" onClick={onOpenFilters} disabled={busy}>Filters{filterCount>0?` (${filterCount})`:''}</Button>}
   {onOpenSort&&<Button variant="secondary" onClick={onOpenSort} disabled={busy}>Sort{sortSummary?` · ${sortSummary}`:''}</Button>}
  </div>
 </div>;
}
