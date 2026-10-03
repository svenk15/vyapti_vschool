"use client";
import { useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
type FieldProps={label:string;hint?:string;error?:string};
export function TextField({label,hint,error,id,...props}:InputHTMLAttributes<HTMLInputElement>&FieldProps) {
 const unique=useId(),fieldId=id??unique,description=error??hint;
 return <div className="field"><label htmlFor={fieldId}>{label}{props.required&&<span aria-hidden="true"> *</span>}</label><input {...props} id={fieldId} aria-invalid={Boolean(error)||undefined} aria-describedby={description?`${fieldId}-hint`:undefined}/>{description&&<p id={`${fieldId}-hint`} className={error?"field-error":"field-hint"}>{description}</p>}</div>;
}
export function SelectField({label,hint,error,id,children,...props}:SelectHTMLAttributes<HTMLSelectElement>&FieldProps&{children:ReactNode}) {
 const unique=useId(),fieldId=id??unique,description=error??hint;
 return <div className="field"><label htmlFor={fieldId}>{label}</label><select {...props} id={fieldId} aria-invalid={Boolean(error)||undefined} aria-describedby={description?`${fieldId}-hint`:undefined}>{children}</select>{description&&<p id={`${fieldId}-hint`} className={error?"field-error":"field-hint"}>{description}</p>}</div>;
}
export function TextArea({label,hint,error,id,...props}:TextareaHTMLAttributes<HTMLTextAreaElement>&FieldProps) {
 const unique=useId(),fieldId=id??unique,description=error??hint;
 return <div className="field"><label htmlFor={fieldId}>{label}</label><textarea {...props} id={fieldId} aria-invalid={Boolean(error)||undefined} aria-describedby={description?`${fieldId}-hint`:undefined}/>{description&&<p id={`${fieldId}-hint`} className={error?"field-error":"field-hint"}>{description}</p>}</div>;
}
export function Checkbox({label,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string}) {return <label className="check-control"><input {...props} type="checkbox"/><span>{label}</span></label>;}
export function Switch({label,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string}) {return <label className="switch-control"><span>{label}</span><input {...props} type="checkbox" role="switch"/><span className="switch-track" aria-hidden="true"/></label>;}
export function RadioGroup({label,name,options,value,onChange}:{label:string;name:string;options:{value:string;label:string}[];value:string;onChange:(value:string)=>void}) {return <fieldset className="radio-group"><legend>{label}</legend>{options.map(o=><label key={o.value} className="check-control"><input type="radio" name={name} value={o.value} checked={value===o.value} onChange={()=>onChange(o.value)}/>{o.label}</label>)}</fieldset>;}
export function DateRange({from,to,onChange}:{from:string;to:string;onChange:(value:{from:string;to:string})=>void}) {return <fieldset className="date-range"><legend>Date range</legend><TextField type="date" label="From" value={from} onChange={e=>onChange({from:e.target.value,to})}/><TextField type="date" label="Through" value={to} min={from} onChange={e=>onChange({from,to:e.target.value})}/></fieldset>;}
export function FileUpload({label,onFile}:{label:string;onFile:(file:File|null)=>void}) {return <TextField type="file" label={label} accept=".csv,text/csv" hint="CSV only · maximum 2 MiB. This preview does not upload a file." onChange={e=>onFile(e.target.files?.[0]??null)}/>;}
