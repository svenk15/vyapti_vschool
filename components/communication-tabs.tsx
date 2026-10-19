import Link from 'next/link';

export function CommunicationTabs(){
 return <nav className="workspace-tabs communication-tabs" aria-label="Communication views">
  <Link href="/admin/communication#published-notices" aria-current="page">Notices</Link>
  <Link href="/admin/communication#notice-proposals">Drafts &amp; approvals</Link>
  <Link href="/admin/communication#delivery-follow-up">Delivery &amp; follow-up</Link>
 </nav>;
}
