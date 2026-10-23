"use client";
import { useId, useState } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
export type FieldWidth="auto"|"numeric"|"date"|"status"|"code"|"person"|"email"|"wide"|"context"|"full";
type FieldProps={label:string;hint?:string;error?:string;width?:FieldWidth;className?:string;optional?:boolean};
function fieldClass(width:FieldWidth,className?:string){return `field field-width-${width}${className?` ${className}`:""}`;}
export function TextField({label,hint,error,id,width="auto",className,optional=false,...props}:InputHTMLAttributes<HTMLInputElement>&FieldProps) {
 const unique=useId(),fieldId=id??unique,description=error??hint;
 return <div className={fieldClass(width,className)}><label htmlFor={fieldId}>{label}{props.required&&<span aria-hidden="true"> *</span>}{optional&&<span className="field-optional">Optional</span>}</label><input {...props} id={fieldId} aria-invalid={Boolean(error)||undefined} aria-describedby={description?`${fieldId}-hint`:undefined}/>{description&&<p id={`${fieldId}-hint`} className={error?"field-error":"field-hint"} role={error?"alert":undefined}>{description}</p>}</div>;
}
export function SelectField({label,hint,error,id,children,width="auto",className,...props}:SelectHTMLAttributes<HTMLSelectElement>&FieldProps&{children:ReactNode}) {
 const unique=useId(),fieldId=id??unique,description=error??hint;
 return <div className={fieldClass(width,className)}><label htmlFor={fieldId}>{label}{props.required&&<span aria-hidden="true"> *</span>}</label><select {...props} id={fieldId} aria-invalid={Boolean(error)||undefined} aria-describedby={description?`${fieldId}-hint`:undefined}>{children}</select>{description&&<p id={`${fieldId}-hint`} className={error?"field-error":"field-hint"} role={error?"alert":undefined}>{description}</p>}</div>;
}
export function TextArea({label,hint,error,id,width="wide",className,variant="short",...props}:TextareaHTMLAttributes<HTMLTextAreaElement>&FieldProps&{variant?:"short"|"long"}) {
 const unique=useId(),fieldId=id??unique,description=error??hint;
 return <div className={`${fieldClass(width,className)} field-textarea-${variant}`}><label htmlFor={fieldId}>{label}{props.required&&<span aria-hidden="true"> *</span>}</label><textarea {...props} rows={props.rows??(variant==="long"?6:3)} id={fieldId} aria-invalid={Boolean(error)||undefined} aria-describedby={description?`${fieldId}-hint`:undefined}/>{description&&<p id={`${fieldId}-hint`} className={error?"field-error":"field-hint"} role={error?"alert":undefined}>{description}</p>}</div>;
}
export function Checkbox({label,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string}) {return <label className="check-control"><input {...props} type="checkbox"/><span>{label}</span></label>;}
export function Switch({label,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string}) {return <label className="switch-control"><span>{label}</span><input {...props} type="checkbox" role="switch"/><span className="switch-track" aria-hidden="true"/></label>;}
export function RadioGroup({label,name,options,value,onChange}:{label:string;name:string;options:{value:string;label:string}[];value:string;onChange:(value:string)=>void}) {return <fieldset className="radio-group"><legend>{label}</legend>{options.map(o=><label key={o.value} className="check-control"><input type="radio" name={name} value={o.value} checked={value===o.value} onChange={()=>onChange(o.value)}/>{o.label}</label>)}</fieldset>;}
export function DateRange({from,to,onChange}:{from:string;to:string;onChange:(value:{from:string;to:string})=>void}) {return <fieldset className="date-range"><legend>Date range</legend><TextField type="date" label="From" value={from} onChange={e=>onChange({from:e.target.value,to})}/><TextField type="date" label="Through" value={to} min={from} onChange={e=>onChange({from,to:e.target.value})}/></fieldset>;}
export function FileUpload({label,onFile}:{label:string;onFile:(file:File|null)=>void}) {
 const [error,setError]=useState<string>();
 return <TextField type="file" label={label} accept=".csv,text/csv" hint="CSV only · maximum 2 MiB. This preview does not upload a file." error={error} onChange={e=>{
  const file=e.target.files?.[0]??null;
  const problem=file&&!/\.csv$/i.test(file.name)?"Choose a CSV file (.csv).":file&&file.size>2*1024*1024?"Choose a file no larger than 2 MiB.":undefined;
  setError(problem);
  if(problem){e.target.value="";onFile(null);return;}
  onFile(file);
 }}/>;
}
