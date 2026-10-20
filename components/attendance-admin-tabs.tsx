import {AdminLocalNavigation} from './admin-local-navigation';

type AttendanceView = 'sessions' | 'corrections' | 'explanations';

const views: readonly {id: AttendanceView; href: string}[] = [
  {id: 'sessions', href: '/admin/attendance/sessions?view=monitor'},
  {id: 'corrections', href: '/admin/attendance/correction-requests'},
  {id: 'explanations', href: '/admin/attendance/explanations'},
];

export function AttendanceAdminTabs({active}: {active?: AttendanceView}) {
  return <AdminLocalNavigation label="Attendance destinations" area="attendance" current={views.find(view=>view.id===active)?.href??''}/>;
}
