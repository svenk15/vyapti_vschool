"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import type {StudentWorkspace} from "@/shared/contracts/students";
import {SelectField} from "@/components/ui/forms";
import {Alert,Button,Card,SectionHeader} from "@/components/ui/primitives";

export function StudentEnrollmentPicker({students,hasMore,returnTo}:{students:StudentWorkspace["items"];hasMore:boolean;returnTo:string}){
  const router=useRouter(),[studentId,setStudentId]=useState("");
  return <div className="branch-edit-grid student-enrollment-grid"><Card className="branch-edit-card student-enrollment-card"><SectionHeader title="Enrollment" description="Choose an active student before selecting an open academic year."/>{hasMore&&<Alert tone="info" title="Showing the first 100 active students">Use the Students directory to find another student, then choose Enroll / place student from Manage.</Alert>}<SelectField label="Student" required value={studentId} onChange={event=>setStudentId(event.target.value)}><option value="">Choose a student</option>{students.map(student=><option key={student.studentId} value={student.studentId}>{student.displayName} · {student.admissionNumber}</option>)}</SelectField><div className="workflow-actions"><Button variant="secondary" onClick={()=>router.push(returnTo)}>Cancel</Button><Button disabled={!studentId} onClick={()=>router.push(`/admin/students/${studentId}/enrollment?returnTo=${encodeURIComponent(returnTo)}`)}>Continue <span aria-hidden="true">→</span></Button></div></Card><aside className="branch-edit-aside"><Card className="padded"><h2>What this changes</h2><p>The selected Student remains fixed while the enrollment and dated class placement are reviewed.</p><div className="section-divider"/><h3>Before you continue</h3><p>Only active Students returned by the authorized current-branch directory are available.</p></Card></aside></div>;
}
