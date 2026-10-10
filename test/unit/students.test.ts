import { describe, expect, it } from "vitest";
import { archiveInput, enrollmentInput, existingPersonReference, studentInput, studentListQuery, transferInput } from "../../backend/modules/students/domain/student";

describe("student registration inputs",()=>{
  it("preserves admission-number zeros and treats a selected Person as an explicit reference",()=>{
    const input=studentInput({firstName:"  Synthetic  ",lastName:" Learner ",admissionNumber:" 0007 ",existingPersonId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf12"});
    expect(input).toEqual({firstName:"Synthetic",lastName:"Learner",admissionNumber:"0007",existingPersonId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf12"});
    expect(studentInput({firstName:"Synthetic",admissionNumber:"0007"}).existingPersonId).toBeNull();
  });

  it("rejects malformed identity and bounds exact-Person lookup separately from list search",()=>{
    expect(()=>studentInput({firstName:"\n",admissionNumber:"0007"})).toThrow("VALIDATION");
    expect(()=>studentInput({firstName:"Synthetic",admissionNumber:" ".repeat(3)})).toThrow("VALIDATION");
    expect(()=>studentInput({firstName:"Synthetic",admissionNumber:"0007",existingPersonId:"foreign"})).toThrow("VALIDATION");
    expect(existingPersonReference("PERSON_ID","D7E5B2A2-09C3-4B2B-9B02-C29E01ADDF12")).toEqual({kind:"PERSON_ID",personId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf12"});
    expect(existingPersonReference("ADMISSION_NUMBER"," 0007 ")).toEqual({kind:"ADMISSION_NUMBER",admissionNumber:"0007"});
    expect(()=>existingPersonReference("PERSON_ID","x")).toThrow("VALIDATION");
    expect(()=>existingPersonReference("NAME","Synthetic Learner")).toThrow("VALIDATION");
    expect(studentListQuery({search:" 0007 "})).toMatchObject({search:"0007",status:"ACTIVE",limit:50});
    expect(studentListQuery({status:"ALL"}).status).toBe("ALL");
    expect(()=>studentListQuery({status:"PENDING"})).toThrow("VALIDATION");
    expect(()=>studentListQuery({search:"x".repeat(101)})).toThrow("VALIDATION");
  });

  it("converts the inclusive final day to an exclusive civil-date bound and preserves roll text",()=>{
    expect(enrollmentInput({studentId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf12",yearId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf13",sectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",startsOn:"2028-02-28",lastDay:"2028-02-29",rollNumber:" 0007 "})).toEqual({studentId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf12",yearId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf13",sectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",validFrom:"2028-02-28",validTo:"2028-03-01",rollNumber:"0007"});
    expect(()=>enrollmentInput({studentId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf12",yearId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf13",sectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",startsOn:"2027-02-29",lastDay:"2027-03-01"})).toThrow("VALIDATION");
    expect(()=>enrollmentInput({studentId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf12",yearId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf13",sectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",startsOn:"2027-03-02",lastDay:"2027-03-01"})).toThrow("VALIDATION");
  });

  it("validates transfer boundaries, version, reason and optional text roll number",()=>{
    const value=transferInput({expectedVersion:2,toSectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",effectiveDate:"2026-10-06",rollNumber:" 0007 ",reason:"Move to the new section"});
    expect(value).toEqual({expectedVersion:2,toSectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",effectiveDate:"2026-10-06",rollNumber:"0007",reason:"Move to the new section"});
    expect(transferInput({expectedVersion:1,toSectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",effectiveDate:"2026-10-06",reason:"Move section"}).rollNumber).toBeUndefined();
    expect(()=>transferInput({expectedVersion:0,toSectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",effectiveDate:"2026-10-06",reason:"Move section"})).toThrow("VALIDATION");
    expect(()=>transferInput({expectedVersion:1,toSectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",effectiveDate:"2026-02-30",reason:"Move section"})).toThrow("VALIDATION");
    expect(()=>transferInput({expectedVersion:1,toSectionId:"d7e5b2a2-09c3-4b2b-9b02-c29e01addf14",effectiveDate:"2026-10-06",reason:"no"})).toThrow("VALIDATION");
  });

  it("requires a bounded archive reason and positive student version",()=>{
    expect(archiveInput({expectedVersion:1,reason:"Graduated"})).toEqual({expectedVersion:1,reason:"Graduated"});
    expect(()=>archiveInput({expectedVersion:-1,reason:"Graduated"})).toThrow("VALIDATION");
    expect(()=>archiveInput({expectedVersion:1,reason:"\n"})).toThrow("VALIDATION");
  });
});
