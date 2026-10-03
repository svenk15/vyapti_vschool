import fs from "node:fs";
import path from "node:path";
import { readTasks } from "./docs-model.mjs";

const tasks = readTasks(), errors = [];
const ids = new Set(tasks.map(t => t.id));
if (ids.size !== tasks.length) errors.push("Duplicate task IDs");
const allowed = ["NOT_STARTED", "IMPLEMENTED", "IN_PROGRESS", "VERIFIED", "BLOCKED"];
const reviews = ["NOT_REQUESTED", "PENDING", "PASSED", "FAILED"];
for (const t of tasks) {
  if (!allowed.includes(t.implementation) || !reviews.includes(t.review)) errors.push(`Invalid status ${t.id}`);
  for (const dep of t.dependencies) if (!ids.has(dep)) errors.push(`Missing dependency ${dep}`);
  const plan = fs.readFileSync(`docs/modules/${t.module}/TASKS.md`, "utf8");
  const section = plan.split(`## ${t.id} — `)[1]?.split("\n## ")[0];
  if (!section) errors.push(`Missing task section ${t.id}`);
  if (!section?.includes(`Depends on: ${t.dependencies.join(", ") || "none"}`)) errors.push(`Dependency drift ${t.id}`);
  if (!section?.includes("### Demo and checkpoint")) errors.push(`Missing demo ${t.id}`);
  const design = fs.readFileSync(`docs/modules/${t.module}/DESIGN.md`, "utf8");
  if (!design.includes(`## ${t.id} — `)) errors.push(`Missing design flow ${t.id}`);
}
function visit(id, visiting = new Set(), done = new Set()) {
  if (visiting.has(id)) { errors.push(`Dependency cycle at ${id}`); return; }
  if (done.has(id)) return;
  visiting.add(id);
  for (const dep of tasks.find(t => t.id === id)?.dependencies ?? []) visit(dep, visiting, done);
  visiting.delete(id); done.add(id);
}
for (const id of ids) visit(id);
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith(".md")) {
      const text = fs.readFileSync(file,"utf8");
      if ((text.match(/^```/gm) ?? []).length % 2) errors.push(`Unbalanced code fence ${file}`);
      for (const m of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
        const ref=m[1].split("#")[0];
        if (!ref || /^(https?:|mailto:)/.test(ref)) continue;
        if (!fs.existsSync(path.resolve(path.dirname(file),ref))) errors.push(`Broken link ${file}: ${ref}`);
      }
    }
  }
}
walk("docs");
if(errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Documentation checks passed: ${tasks.length} tasks, valid links, design coverage, statuses and acyclic dependencies.`);
