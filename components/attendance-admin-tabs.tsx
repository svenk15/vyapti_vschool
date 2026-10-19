import Link from 'next/link';

type AttendanceView = 'sessions' | 'reports' | 'explanations';

const views: readonly {id: AttendanceView; href: string; label: string}[] = [
  {id: 'sessions', href: '/admin/attendance/sessions?view=monitor', label: 'Sessions'},
  {id: 'reports', href: '/admin/reports/attendance', label: 'Attendance reports'},
  {id: 'explanations', href: '/admin/attendance/explanations', label: 'Absence explanations'},
];

export function AttendanceAdminTabs({active}: {active?: AttendanceView}) {
  return (
    <nav className="workspace-tabs" aria-label="Attendance views">
      {views.map((view) => (
        <Link key={view.id} href={view.href} aria-current={active === view.id ? 'page' : undefined}>
          {view.label}
        </Link>
      ))}
    </nav>
  );
}
