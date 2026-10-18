import Link from 'next/link';

export type PrincipalContextualNavigationItem=Readonly<{label:string;href:string;current?:boolean}>;

export function PrincipalContextualNavigation({label,items}:{label:string;items:readonly PrincipalContextualNavigationItem[]}){
 if(items.length<2)return null;
 return <nav className="principal-contextual-nav" aria-label={label}>{items.map(item=><Link key={item.href} href={item.href} aria-current={item.current?'page':undefined}>{item.label}</Link>)}</nav>;
}
