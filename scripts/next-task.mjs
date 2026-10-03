import { readTasks } from "./docs-model.mjs";

const tasks = readTasks();
const acceptedDependency = id => tasks.some(t => t.id === id && t.implementation === "VERIFIED" && ["PASSED", "PENDING"].includes(t.review));
const task = tasks.find(t => t.review === "FAILED")
  ?? tasks.find(t => t.implementation === "IN_PROGRESS")
  ?? tasks.find(t => ["NOT_STARTED", "IMPLEMENTED"].includes(t.implementation) && t.dependencies.every(acceptedDependency));
if (task) {
  console.log(`Suggested task: ${task.id} — ${task.title}\nRead docs/modules/${task.module}/DESIGN.md, TASKS.md and CURRENT_STATE.md.`);
} else {
  console.log("No automatically eligible task. Review blocked work and pending acceptance in module states.");
}
console.log("Read-only suggestion. User pauses and release gates override this order; no task or timer was started.");
