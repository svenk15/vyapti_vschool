import {PrincipalContextualNavigation} from '@/components/principal-contextual-navigation';

export type TimetableNavigationAvailability=Readonly<{timetable:boolean;cover:boolean}>;
export type LearningNavigationAvailability=Readonly<{overview:boolean;evidence:boolean}>;
export type AssessmentsNavigationAvailability=Readonly<{readiness:boolean;publication:boolean}>;

export function PrincipalTimetableNavigation({current,availability}:{current:'timetable'|'cover';availability:TimetableNavigationAvailability}){
 const items=[...(availability.timetable?[{label:'Exceptions',href:'/leadership/timetable',current:current==='timetable'}]:[]),...(availability.cover?[{label:'Cover requests',href:'/leadership/cover',current:current==='cover'}]:[])];
 return <PrincipalContextualNavigation label="Timetable and cover" items={items}/>;
}

export function PrincipalLearningNavigation({current,availability}:{current:'completion'|'feedback'|'evidence';availability:LearningNavigationAvailability}){
 const items=[...(availability.overview?[{label:'Assignment completion',href:'/leadership/learning',current:current==='completion'},{label:'Feedback turnaround',href:'/leadership/learning/feedback',current:current==='feedback'}]:[]),...(availability.evidence?[{label:'Pupil evidence',href:'/leadership/learning/evidence',current:current==='evidence'}]:[])];
 return <PrincipalContextualNavigation label="Learning" items={items}/>;
}

export function PrincipalAssessmentsNavigation({current,availability}:{current:'readiness'|'publication';availability:AssessmentsNavigationAvailability}){
 const items=[...(availability.readiness?[{label:'Readiness',href:'/leadership/assessments',current:current==='readiness'}]:[]),...(availability.publication?[{label:'Report publication',href:'/leadership/assessments/publications',current:current==='publication'}]:[])];
 return <PrincipalContextualNavigation label="Assessments" items={items}/>;
}
