'use client';
import {useId,type KeyboardEvent} from 'react';
import {Button} from '@/components/ui/primitives';

export type SearchAttribute=Readonly<{value:string;label:string;placeholder?:string}>;
function ToolbarIcon({name}:{name:'search'|'filter'|'sort'}){return <svg className="toolbar-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{name==='search'?<><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>:name==='filter'?<><path d="M4 6h16M7 12h10M10 18h4"/></>:<><path d="M8 4v16M5 7l3-3 3 3M16 20V4m-3 13 3 3 3-3"/></>}</svg>}

export function ListToolbar({attributes,selectedAttribute,draftText,appliedSearch,onAttributeChange,onDraftTextChange,onCommitSearch,filterCount=0,onOpenFilters,sortSummary,onOpenSort,busy=false,inputLabel='Search records',maximumLength=100}:{attributes:readonly SearchAttribute[];selectedAttribute:string;draftText:string;appliedSearch:string;onAttributeChange:(value:string)=>void;onDraftTextChange:(value:string)=>void;onCommitSearch:(value:string)=>void;filterCount?:number;onOpenFilters?:()=>void;sortSummary?:string;onOpenSort?:()=>void;busy?:boolean;inputLabel?:string;maximumLength?:number}){
 const id=useId(),attributeId=`${id}-attribute`,inputId=`${id}-input`,sortStatusId=`${id}-sort-status`;
 const commit=()=>onCommitSearch(draftText.normalize('NFC').trim().slice(0,maximumLength));
 const keyDown=(event:KeyboardEvent<HTMLInputElement>)=>{if(event.key==='Enter'){event.preventDefault();commit();}};
 const clear=()=>{onDraftTextChange('');onCommitSearch('');};
 return <div className="list-toolbar" role="search" aria-label="List search and controls">
  <div className="list-search-composition">
   <label className="sr-only" htmlFor={attributeId}>Search by</label>
   <select id={attributeId} aria-label="Search by" value={selectedAttribute} onChange={event=>onAttributeChange(event.target.value)} disabled={busy}>{attributes.map(attribute=><option key={attribute.value} value={attribute.value}>{attribute.label}</option>)}</select>
   <ToolbarIcon name="search"/>
   <label className="sr-only" htmlFor={inputId}>{inputLabel}</label>
   <input id={inputId} type="search" aria-label={inputLabel} maxLength={maximumLength} value={draftText} placeholder={attributes.find(attribute=>attribute.value===selectedAttribute)?.placeholder} onChange={event=>onDraftTextChange(event.target.value)} onKeyDown={keyDown} disabled={busy}/>
   {(draftText||appliedSearch)&&<Button size="small" variant="ghost" onClick={clear} disabled={busy} aria-label={`Clear ${inputLabel.toLowerCase()}`}>Clear</Button>}
  </div>
  <div className="list-toolbar-actions">
   {onOpenFilters&&<Button variant="secondary" onClick={onOpenFilters} disabled={busy}><ToolbarIcon name="filter"/>Filters{filterCount>0?` (${filterCount})`:''}</Button>}
   {onOpenSort&&<><Button variant="secondary" onClick={onOpenSort} disabled={busy} aria-describedby={sortSummary?sortStatusId:undefined}><ToolbarIcon name="sort"/>Sort</Button>{sortSummary&&<span id={sortStatusId} className="sr-only">Currently sorted by {sortSummary}</span>}</>}
  </div>
 </div>;
}
