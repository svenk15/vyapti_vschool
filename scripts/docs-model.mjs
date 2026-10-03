import fs from "node:fs";

export function readTasks() {
  const tasks = [];
  for (const line of fs.readFileSync("docs/EXECUTION_INDEX.md", "utf8").split("\n")) {
    const cells = line.split("|").map(x => x.trim());
    if (!/^[A-Z]+-\d{2}$/.test(cells[1] ?? "")) continue;
    const moduleName = cells[2].match(/^\[([^\]]+)\]/)?.[1];
    if (!moduleName || !/^[a-z-]+$/.test(moduleName)) throw new Error("Invalid module index");
    const state = fs.readFileSync(`docs/modules/${moduleName}/CURRENT_STATE.md`, "utf8");
    const row = state.split("\n").find(x => x.split("|")[1]?.trim() === cells[1]);
    if (!row) throw new Error(`Missing state: ${cells[1]}`);
    const status = row.split("|").map(x => x.trim());
    tasks.push({ id: cells[1], module: moduleName, title: cells[3], dependencies: cells[4] === "none" ? [] : cells[4].split(", "), implementation: status[2], review: status[3] });
  }
  return tasks;
}
