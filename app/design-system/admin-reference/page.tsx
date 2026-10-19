import {AdministratorExperienceReference,type AdministratorReferenceView} from '@/components/administrator-experience-reference';

const views:readonly AdministratorReferenceView[]=['today','students','record','registration'];

export default async function AdministratorReferencePage({searchParams}:{searchParams:Promise<{view?:string|string[]}>}){
 const query=await searchParams,value=Array.isArray(query.view)?query.view[0]:query.view,initialView=views.includes(value as AdministratorReferenceView)?value as AdministratorReferenceView:'today';
 return <AdministratorExperienceReference initialView={initialView}/>;
}
