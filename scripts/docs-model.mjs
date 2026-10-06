import fs from "node:fs";

export function readTasks() {
  const tasks = [];
  const index = fs.readFileSync("docs/EXECUTION_INDEX.md", "utf8");
  const demoOverrides = new Map();
  let inDemoPolicy = false;
  for (const line of index.split("\n")) {
    if (line.startsWith("## ")) inDemoPolicy = line.startsWith("## PHASE 1 DEMO READY sequencing decision");
    if (inDemoPolicy && line.startsWith("| ")) {
      const cells = line.split("|").map(x => x.trim());
      if (/^[A-Z]+-\d{2}$/.test(cells[1] ?? "")) {
        demoOverrides.set(cells[1], {
          deferredForDemo: /^yes\b/.test(cells[2] ?? ""),
          demoDependencies: /^yes\b/.test(cells[2] ?? "") || cells[3] === "—" ? undefined : cells[3].split(", "),
        });
      }
    }
  }
  for (const line of index.split("\n")) {
    const cells = line.split("|").map(x => x.trim());
    if (!/^[A-Z]+-\d{2}$/.test(cells[1] ?? "")) continue;
    if (!cells[2]?.startsWith("[")) continue;
    const moduleName = cells[2].match(/^\[([^\]]+)\]/)?.[1];
    if (!moduleName || !/^[a-z-]+$/.test(moduleName)) throw new Error("Invalid module index");
    const state = fs.readFileSync(`docs/modules/${moduleName}/CURRENT_STATE.md`, "utf8");
    const row = state.split("\n").find(x => x.split("|")[1]?.trim() === cells[1]);
    if (!row) throw new Error(`Missing state: ${cells[1]}`);
    const status = row.split("|").map(x => x.trim());
    tasks.push({ id: cells[1], module: moduleName, title: cells[3], dependencies: cells[4] === "none" ? [] : cells[4].split(", "), implementation: status[2], review: status[3], ...demoOverrides.get(cells[1]) });
  }
  return tasks;
}
