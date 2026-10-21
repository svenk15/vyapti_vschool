"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button, EmptyState } from "./primitives";

export function Dialog({open,onClose,title,description,children,drawer=false,showDescription=false,className}:{open:boolean;onClose:()=>void;title:string;description?:string;children:ReactNode;drawer?:boolean;showDescription?:boolean;className?:string}) {
 const ref=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),id=useId();
  useEffect(()=>{const node=ref.current;if(!node)return;if(open&&!node.open){opener.current=document.activeElement instanceof HTMLElement?document.activeElement:null;node.showModal();queueMicrotask(()=>node.querySelector<HTMLElement>("[autofocus]")?.focus());}else if(!open&&node.open){node.close();queueMicrotask(()=>opener.current?.focus());}},[open]);
 return <dialog ref={ref} className={`${drawer?"dialog drawer":"dialog"}${className?` ${className}`:""}`} aria-labelledby={`${id}-title`} aria-describedby={description?`${id}-description`:undefined} onCancel={event=>{event.preventDefault();onClose();}} onKeyDown={e=>{
  if(e.key!=="Tab")return;
  const node=e.currentTarget;
  const controls=Array.from(node.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,summary,[tabindex],[contenteditable="true"]')).filter(control=>control.tabIndex>=0&&!control.matches(":disabled")&&control.getClientRects().length>0);
  const first=controls[0],last=controls.at(-1);
  if(!first){e.preventDefault();node.focus();return;}
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }}>{drawer?<div className="drawer-layout"><header className="drawer-header"><div><h2 id={`${id}-title`}>{title}</h2>{description&&showDescription&&<p id={`${id}-description`} className="drawer-header-description">{description}</p>}</div><Button className="drawer-close" variant="ghost" onClick={onClose} aria-label={`Close ${title}`}><span aria-hidden="true">×</span></Button></header>{description&&!showDescription&&<p id={`${id}-description`} className="sr-only">{description}</p>}<div className="drawer-body">{children}</div></div>:<><div className="spread"><h2 id={`${id}-title`}>{title}</h2><Button variant="ghost" onClick={onClose} aria-label={`Close ${title}`}>×</Button></div>{description&&<p id={`${id}-description`} className="muted">{description}</p>}{children}</>}</dialog>;
}
export function Tabs({items}:{items:{id:string;label:string;content:ReactNode}[]}) {
 const [active,setActive]=useState(0),id=useId();
 return <div className="tabs"><div className="tab-list" role="tablist" aria-label="Component examples">{items.map((item,i)=><button key={item.id} role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>{const directions:Record<string,number>={ArrowRight:(i+1)%items.length,ArrowLeft:(i-1+items.length)%items.length,Home:0,End:items.length-1};const next=directions[e.key];if(next!==undefined){e.preventDefault();setActive(next);(e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();}}}>{item.label}</button>)}</div>{items.map((item,i)=><div key={item.id} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={active!==i} tabIndex={0} className="tab-panel">{item.content}</div>)}</div>;
}
export function Toast({message,onDismiss}:{message:string;onDismiss:()=>void}) {return <div className="toast"><div role="status">{message}</div><Button variant="ghost" onClick={onDismiss} aria-label="Dismiss notification">×</Button></div>;}
export function Disclosure({title,children}:{title:string;children:ReactNode}) {return <details className="disclosure"><summary>{title}</summary><div>{children}</div></details>;}
export function Tooltip({text,children}:{text:string;children:ReactNode}) {const id=useId();const [hidden,setHidden]=useState(false);return <span className={`tooltip-wrap ${hidden?"tooltip-dismissed":""}`} tabIndex={0} aria-describedby={id} onFocus={()=>setHidden(false)} onMouseEnter={()=>setHidden(false)} onKeyDown={e=>{if(e.key==="Escape")setHidden(true);}}>{children}<span className="tooltip" role="tooltip" id={id}>{text}</span></span>;}

export type Column<T>={key:string;label:string;render:(row:T)=>ReactNode;sortValue?:(row:T)=>string|number};
export function DataTable<T>({caption,rows,columns,rowKey,pageSize=5}:{caption:string;rows:readonly T[];columns:Column<T>[];rowKey:(row:T)=>string;pageSize?:number}) {
 const [sort,setSort]=useState<{key:string;descending:boolean}|null>(null),[page,setPage]=useState(0),id=useId();
 const column=columns.find(c=>c.key===sort?.key);
 const sorted=[...rows].sort((a,b)=>{if(!column?.sortValue)return 0;const x=column.sortValue(a),y=column.sortValue(b);const compared=typeof x==="number"&&typeof y==="number"?x-y:String(x).localeCompare(String(y));return sort?.descending?-compared:compared;});
 const pages=Math.max(1,Math.ceil(rows.length/pageSize)),current=Math.min(page,pages-1),visible=sorted.slice(current*pageSize,(current+1)*pageSize);
 if(!rows.length)return <EmptyState title="No matching records" description="Try another search or clear the filters."/>;
 return <div><div className="table-scroll" tabIndex={0} role="region" aria-labelledby={id}><table className="data-table"><caption id={id}>{caption}</caption><thead><tr>{columns.map(c=><th key={c.key} scope="col" aria-sort={sort?.key===c.key?(sort.descending?"descending":"ascending"):undefined}>{c.sortValue?<button onClick={()=>{setSort({key:c.key,descending:sort?.key===c.key?!sort.descending:false});setPage(0);}}>{c.label}<span aria-hidden="true"> {sort?.key===c.key?(sort.descending?"↓":"↑"):"↕"}</span></button>:c.label}</th>)}</tr></thead><tbody>{visible.map(row=><tr key={rowKey(row)}>{columns.map(c=><td key={c.key}>{c.render(row)}</td>)}</tr>)}</tbody></table></div><nav className="pagination" aria-label={`${caption} pagination`}><span className="small muted" aria-live="polite">{current*pageSize+1}–{Math.min((current+1)*pageSize,rows.length)} of {rows.length}</span><div><Button variant="secondary" size="small" disabled={current===0} onClick={()=>setPage(current-1)}>Previous</Button><Button variant="secondary" size="small" disabled={current===pages-1} onClick={()=>setPage(current+1)}>Next</Button></div></nav></div>;
}
