"use client";

import {useEffect,useRef} from "react";
import {Alert} from "@/components/ui/primitives";

export function StudentProfileArrivalNotice({detail}:{detail?:string}){
 const notice=useRef<HTMLDivElement>(null);
 useEffect(()=>{notice.current?.focus();},[]);
 return <div ref={notice} tabIndex={-1} className="student-profile-arrival"><Alert tone="success" title="Student added">{detail??"The school record is ready to review."}</Alert></div>;
}
