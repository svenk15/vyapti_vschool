import type {StudentSelfTimetableLesson,StudentSelfTimetableWeek} from '../../../../shared/contracts/student-portal';

export function nextStudentClass(week:StudentSelfTimetableWeek,schoolDate:string,now:Date):StudentSelfTimetableLesson|null{
 return week.lessons
  .filter(lesson=>lesson.date===schoolDate&&new Date(lesson.startsAt).getTime()>=now.getTime())
  .sort((left,right)=>left.startsAt.localeCompare(right.startsAt)||left.occurrenceId.localeCompare(right.occurrenceId))[0]??null;
}
