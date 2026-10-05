import type {ReactNode} from 'react';
import Link from 'next/link';
import {BrandSurface,Card} from '@/components/ui/primitives';
import {SchoolArt} from '@/components/school-art';

export function AuthLayout({eyebrow,title,description,children,backHref='/',backLabel='Back to VSchool',landmarkId='main-content'}:{eyebrow:string;title:string;description:string;children:ReactNode;backHref?:string;backLabel?:string;landmarkId?:string}){
 return <BrandSurface className="auth-surface"><main id={landmarkId} className="auth-layout"><section className="auth-identity"><Link className="auth-back" href={backHref}>← {backLabel}</Link><Link href="/" className="auth-wordmark"><span className="logo-mark" aria-hidden="true">v</span><span>VSchool</span></Link><div className="auth-intro"><p className="eyebrow">{eyebrow}</p><h1>A thoughtful space for your school.</h1><p>Use the access provided by your school to continue.</p></div><SchoolArt/><p className="auth-footnote">A thoughtful space for every school day.</p></section><section className="auth-work"><div className="auth-work-inner"><div className="auth-work-heading"><p className="eyebrow">VSchool account</p><h2>{title}</h2><p className="muted">{description}</p></div><Card className="padded auth-form-card">{children}</Card><p className="auth-support">Your school controls access to its workspace. VSchool will never ask you to share a password by email.</p></div></section></main></BrandSurface>;
}
