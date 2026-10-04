import { describe, expect, it } from "vitest";
import { exactSelectionName, studentInput, studentListQuery } from "../../backend/modules/students/domain/student";

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
    expect(exactSelectionName(" Synthetic Learner ")).toBe("Synthetic Learner");
    expect(()=>exactSelectionName("x")).toThrow("VALIDATION");
    expect(studentListQuery({search:" 0007 "})).toMatchObject({search:"0007",status:"ACTIVE",limit:50});
    expect(studentListQuery({status:"ALL"}).status).toBe("ALL");
    expect(()=>studentListQuery({status:"PENDING"})).toThrow("VALIDATION");
    expect(()=>studentListQuery({search:"x".repeat(101)})).toThrow("VALIDATION");
  });
});
