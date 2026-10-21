import {describe,expect,it} from "vitest";
import {relationship} from "../../backend/modules/guardians/domain/policy";

describe("guardian relationship",()=>{
  it("accepts only the descriptive owner values and retains legacy absence",()=>{
    expect(relationship("MOTHER")).toBe("MOTHER");
    expect(relationship("FATHER")).toBe("FATHER");
    expect(relationship("GUARDIAN")).toBe("GUARDIAN");
    expect(relationship(undefined)).toBeNull();
    expect(()=>relationship("AUNT")).toThrow("VALIDATION");
  });
});
