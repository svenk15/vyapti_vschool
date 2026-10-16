import { readTasks } from "./docs-model.mjs";

const tasks = readTasks();
const implementationReadyDependency = id => tasks.some(t => t.id === id && t.implementation === "VERIFIED");
const task = tasks.find(t => t.review === "FAILED")
  ?? tasks.find(t => t.implementation === "IN_PROGRESS" && !t.deferredForDemo)
  ?? tasks.find(t => ["NOT_STARTED", "IMPLEMENTED"].includes(t.implementation)
    && (t.demoDependencies ?? t.dependencies).every(implementationReadyDependency));
if (task) {
  console.log(`Suggested task: ${task.id} — ${task.title}${task.demoDependencies ? " (PHASE 1 DEMO READY sequence)" : ""}\nRead docs/modules/${task.module}/DESIGN.md, TASKS.md and CURRENT_STATE.md.`);
} else {
  console.log("No automatically eligible task. Review blocked work and pending acceptance in module states.");
}
console.log("Read-only suggestion. User pauses and release gates override this order; no task or timer was started.");
