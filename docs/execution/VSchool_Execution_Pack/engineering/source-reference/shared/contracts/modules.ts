/** Public manifest and preview helpers; these never authorize a server action. */
export const moduleCatalog = {
  student_core: { name: "Student records", dependencies: [], foundation: true },
  academic_core: { name: "Academic structure", dependencies: [], foundation: true },
  staff_core: { name: "Staff records", dependencies: [], foundation: true },
  attendance: { name: "Attendance", dependencies: ["student_core", "academic_core", "staff_core"], foundation: false },
  fees: { name: "Fees & payments", dependencies: ["student_core"], foundation: false },
  admissions: { name: "Admissions", dependencies: ["student_core"], foundation: false },
  assessments: { name: "Assessments", dependencies: ["student_core", "academic_core", "staff_core"], foundation: false },
  family: { name: "Family portal", dependencies: ["student_core"], foundation: false },
  communication: { name: "Communication", dependencies: [], foundation: false },
  timetable: { name: "Timetable", dependencies: ["academic_core", "staff_core"], foundation: false },
  homework: { name: "Learning & homework", dependencies: ["student_core", "academic_core", "staff_core"], foundation: false },
  transport: { name: "Transport", dependencies: ["student_core"], foundation: false },
  hr: { name: "People operations", dependencies: ["staff_core"], foundation: false },
  library: { name: "Library", dependencies: ["student_core"], foundation: false },
  inventory: { name: "Inventory", dependencies: [], foundation: false },
  health: { name: "Student health", dependencies: ["student_core"], foundation: false },
  analytics: { name: "Insights", dependencies: [], foundation: false },
  ai: { name: "AI assistance", dependencies: [], foundation: false },
} as const;

export type ModuleId = keyof typeof moduleCatalog;
export function isModuleId(value: string): value is ModuleId {
  return Object.prototype.hasOwnProperty.call(moduleCatalog, value);
}

export function dependencyClosure(selected: readonly ModuleId[]): ModuleId[] {
  const result = new Set<ModuleId>();
  function add(id: ModuleId) {
    if (!isModuleId(id)) throw new Error("UNKNOWN_MODULE");
    if (result.has(id)) return;
    result.add(id);
    for (const dependency of moduleCatalog[id].dependencies) add(dependency);
  }
  for (const id of selected) add(id);
  return [...result].sort();
}

