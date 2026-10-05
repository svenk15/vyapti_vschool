import Link from "next/link";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, CSSProperties } from "react";
import { palettes, type BrandPalette } from "@/shared/contracts/branding";

export function BrandSurface({palette,children,className=""}:{palette?:BrandPalette;children:ReactNode;className?:string}) {
 const p=palette?palettes[palette]:null;
 const style=p?{"--primary":p.primary,"--on-primary":p.onPrimary,"--brand-soft":p.soft,"--brand-accent":p.accent} as CSSProperties:undefined;
 return <div style={style} className={`brand-surface ${className}`}>{children}</div>;
}
export function Button({variant="primary",size="normal",loading=false,children,className="",disabled,type="button",...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"secondary"|"ghost"|"danger";size?:"normal"|"small";loading?:boolean}) {
 return <button type={type} className={`btn btn-${variant} btn-${size} ${className}`} disabled={disabled||loading} aria-busy={loading||undefined} {...props}>{loading&&<span className="spinner" aria-hidden="true"/>}{children}</button>;
}
export function ButtonLink({href,children,variant="primary"}:{href:string;children:ReactNode;variant?:"primary"|"secondary"|"ghost"}) {return <Link className={`btn btn-${variant}`} href={href}>{children}</Link>;}
export function Badge({tone="neutral",children}:{tone?:"neutral"|"success"|"warning"|"danger"|"info";children:ReactNode}) {return <span className={`badge badge-${tone}`}>{children}</span>;}
export function Card({children,className="",...props}:HTMLAttributes<HTMLElement>) {return <section className={`card ${className}`} {...props}>{children}</section>;}
export function PageHeader({eyebrow,title,description,actions}:{eyebrow?:string;title:string;description?:string;actions?:ReactNode}) {return <div className="page-heading"><div>{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description&&<p className="muted page-description">{description}</p>}</div>{actions&&<div className="header-actions">{actions}</div>}</div>;}
export function Alert({tone="info",title,children}:{tone?:"info"|"success"|"warning"|"danger";title:string;children?:ReactNode}) {return <div className={`alert alert-${tone}`} role={tone==="danger"?"alert":"status"}><strong>{title}</strong>{children&&<div>{children}</div>}</div>;}
export function EmptyState({title,description,action}:{title:string;description:string;action?:ReactNode}) {return <div className="empty-state"><span className="empty-symbol" aria-hidden="true">◇</span><h3>{title}</h3><p className="muted">{description}</p>{action}</div>;}
export function Skeleton({label="Loading",lines=3}:{label?:string;lines?:number}) {return <div role="status" aria-label={label} className="skeleton-wrap">{Array.from({length:lines},(_,i)=><div key={i} className="skeleton"/>)}<span className="sr-only">{label}</span></div>;}
export function StatCard({label,value,detail}:{label:string;value:string;detail:string}) {return <Card className="stat-card"><p className="muted small">{label}</p><strong className="stat-value">{value}</strong><p className="small muted">{detail}</p></Card>;}
export function Avatar({name}:{name:string}) {return <span className="avatar" aria-label={name}>{name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span>;}
export function Breadcrumbs({items}:{items:{label:string;href?:string}[]}) {return <nav aria-label="Breadcrumb"><ol className="breadcrumbs">{items.map((item,i)=><li key={item.label}>{item.href?<Link href={item.href}>{item.label}</Link>:<span aria-current={i===items.length-1?"page":undefined}>{item.label}</span>}</li>)}</ol></nav>;}
export function Progress({label,value}:{label:string;value:number}) {return <div className="progress-wrap"><div className="spread"><span>{label}</span><span>{Math.round(value)}%</span></div><progress aria-label={label} value={value} max={100}/></div>;}
export function Timeline({items}:{items:{title:string;detail:string;time:string}[]}) {return <ol className="timeline">{items.map((item,i)=><li key={i}><span className="timeline-dot" aria-hidden="true"/><div><strong>{item.title}</strong><p className="muted small">{item.detail}</p><span className="small muted">{item.time}</span></div></li>)}</ol>;}
export function Stepper({steps,current}:{steps:string[];current:number}) {return <ol className="stepper" aria-label="Progress">{steps.map((s,i)=><li key={s} aria-current={i===current?"step":undefined} className={i<=current?"step-active":""}><span>{i<current?"✓":i+1}</span>{s}</li>)}</ol>;}
