const people = [
  {
    id: "emp-1001",
    name: "Avery Morgan",
    code: "EMP-1001",
    category: "Teaching",
    employment: "Active",
    teaching: "Eligible to teach",
    access: "Active",
    initials: "AM",
    contactEmail: "avery.morgan@example.test",
    personVersion: 7,
    employeeVersion: 11,
    history: [{ at: "18 October 2026", text: "Teaching eligibility reviewed" }],
  },
  {
    id: "emp-1002",
    name: "Jordan Lee",
    code: "EMP-1002",
    category: "Administration",
    employment: "Active",
    teaching: "Not enabled",
    access: "Pending invite",
    initials: "JL",
    contactEmail: "jordan.lee@example.test",
    personVersion: 4,
    employeeVersion: 8,
    history: [{ at: "20 October 2026", text: "Portal invitation prepared" }],
  },
  {
    id: "emp-1003",
    name: "Samira Khan",
    code: "EMP-1003",
    category: "Support",
    employment: "Active",
    teaching: "Not enabled",
    access: "No account",
    initials: "SK",
    contactEmail: "samira.khan@example.test",
    personVersion: 3,
    employeeVersion: 5,
    history: [{ at: "12 October 2026", text: "Staff profile added" }],
  },
  {
    id: "emp-0871",
    name: "Theo Martin",
    code: "EMP-0871",
    category: "Teaching",
    employment: "Ended",
    teaching: "Disabled",
    access: "Suspended",
    initials: "TM",
    contactEmail: "theo.martin@example.test",
    personVersion: 6,
    employeeVersion: 14,
    history: [{ at: "18 October 2026", text: "Employment ended and branch access suspended" }],
  },
];

const state = {
  screen: "directory",
  scenario: "populated",
  query: "",
  by: "name",
  filters: { category: "any", employment: "any", teaching: "any", access: "any" },
  sort: { field: "name", order: "asc" },
  profileId: people[0].id,
  correctionDraft: null,
  correctionOutcome: null,
  pendingCorrection: null,
  staleCorrection: null,
  appliedCorrectionKeys: new Set(),
  operationSequence: 0,
  employmentEndIntent: null,
  profileNotice: null,
  teachingOutcome: null,
  accessNotice: null,
  availabilityOutcome: null,
  coverOpened: false,
  addSavedId: null,
  returnFocus: null,
};

const main = document.querySelector("#main");
const overlay = document.querySelector("#overlay");
const scenarioSelect = document.querySelector("#scenario");

const icon = (name) => `<span class="ico"><svg><use href="#i-${name}"/></svg></span>`;
const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character]));
const selected = (actual, expected) => actual === expected ? " selected" : "";
const checked = (actual, expected) => actual === expected ? " checked" : "";
const currentProfile = () => people.find((person) => person.id === state.profileId) ?? people[0];
const todayLabel = "22 October 2026";

function addHistory(person, text) {
  person.history.unshift({ at: todayLabel, text });
}

function addHistoryOnce(person, text) {
  if (!person.history.some((entry) => entry.text === text && entry.at === todayLabel)) addHistory(person, text);
}

function setScenario(value) {
  state.scenario = value;
  scenarioSelect.value = value;
}

function go(screen, extra = {}) {
  if (extra.profile) {
    state.profileId = extra.profile.id;
    delete extra.profile;
  }
  Object.assign(state, { screen }, extra);
  history.pushState(null, "", `#${screen}`);
  closeMobileNavigation(false);
  render();
  main.focus();
}

function tabs(current) {
  return `<nav class="local-nav" aria-label="Staff area">
    <button class="${current === "profiles" ? "current" : ""}" onclick="go('directory')">Profiles</button>
    <button class="${current === "access" ? "current" : ""}" onclick="go('access')">Access</button>
    <button class="${current === "availability" ? "current" : ""}" onclick="go('availability')">Availability</button>
  </nav>`;
}

function normalizedTeaching(person) {
  if (person.teaching.includes("Eligible")) return "eligible";
  if (person.teaching === "Disabled") return "disabled";
  return "not-enabled";
}

function normalizedAccess(person) {
  return ({ Active: "active", "Pending invite": "pending", "No account": "none", Suspended: "suspended" })[person.access] ?? "unknown";
}

function visiblePeople() {
  const query = state.query.trim().toLocaleLowerCase();
  const filtered = people.filter((person) => {
    const searchValue = state.by === "employeeCode" ? person.code : person.name;
    if (query && !searchValue.toLocaleLowerCase().includes(query)) return false;
    if (state.filters.category !== "any" && person.category !== state.filters.category) return false;
    if (state.filters.employment !== "any" && person.employment.toLocaleLowerCase() !== state.filters.employment) return false;
    if (state.filters.teaching !== "any" && normalizedTeaching(person) !== state.filters.teaching) return false;
    if (state.filters.access !== "any" && normalizedAccess(person) !== state.filters.access) return false;
    return true;
  });
  const ranks = {
    employment: { Active: 0, Ended: 1 },
    teaching: { eligible: 0, "not-enabled": 1, disabled: 2 },
    access: { active: 0, pending: 1, none: 2, suspended: 3, unknown: 4 },
  };
  const value = (person) => {
    if (state.sort.field === "code") return person.code;
    if (state.sort.field === "employment") return ranks.employment[person.employment];
    if (state.sort.field === "teaching") return ranks.teaching[normalizedTeaching(person)];
    if (state.sort.field === "access") return ranks.access[normalizedAccess(person)];
    return person.name;
  };
  return filtered.sort((left, right) => {
    const leftValue = value(left);
    const rightValue = value(right);
    const primary = typeof leftValue === "number"
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), "en", { sensitivity: "base" });
    if (primary !== 0) return state.sort.order === "desc" ? -primary : primary;
    return left.id.localeCompare(right.id);
  });
}

function appliedSummary() {
  const labels = [];
  if (state.filters.category !== "any") labels.push(state.filters.category);
  if (state.filters.employment !== "any") labels.push(state.filters.employment === "active" ? "Active" : "Ended");
  if (state.filters.teaching !== "any") labels.push(`Teaching: ${state.filters.teaching.replace("-", " ")}`);
  if (state.filters.access !== "any") labels.push(`Access: ${state.filters.access}`);
  labels.push(`Sorted by ${state.sort.field === "code" ? "Employee code" : state.sort.field} · ${state.sort.order === "asc" ? "ascending" : "descending"}`);
  return `<div class="actions" style="padding:12px 20px;border-bottom:1px solid var(--line)">${labels.map((label) => `<span class="badge">${esc(label)}</span>`).join("")}</div>`;
}

function directory() {
  const view = state.scenario;
  let body = "";
  if (view === "loading") {
    body = `<div class="skeletons" aria-label="Loading Staff"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>`;
  } else if (view === "empty") {
    body = `<div class="empty"><span class="symbol">${icon("people")}</span><h2>No staff profiles yet</h2><p>Add the first Staff profile for this branch. Sign-in access is set up separately.</p><button class="btn primary" onclick="go('add')">Add staff</button></div>`;
  } else if (view === "read-failure") {
    body = `<div class="empty"><span class="symbol">!</span><h2>Staff could not be loaded</h2><p>Your branch is unchanged. Try again when the service is available.</p><button class="btn secondary" onclick="setScenario('populated');render()">Try again</button></div>`;
  } else {
    const results = view === "no-results" ? [] : visiblePeople();
    if (!results.length) {
      body = `<div class="empty"><span class="symbol">${icon("people")}</span><h2>No matching staff</h2><p>Change the search or clear the applied filters.</p><button class="btn secondary" onclick="clearDirectoryQuery()">Clear search and filters</button></div>`;
    } else {
      const rows = results.map((person) => `<tr>
        <td data-label="Staff"><div class="person"><span class="avatar">${person.initials}</span><span><b>${esc(person.name)}</b><small>${esc(person.code)}</small></span></div></td>
        <td data-label="Category">${esc(person.category)}</td>
        <td data-label="Employment"><span class="badge ${person.employment === "Active" ? "good" : ""}">${person.employment}</span></td>
        <td data-label="Teaching">${esc(person.teaching)}</td>
        <td data-label="Access">${esc(person.access)}</td>
        <td><button class="btn ghost compact" onclick="go('profile',{profile:people.find((item)=>item.id==='${person.id}')})">Profile</button></td>
      </tr>`).join("");
      body = `<div class="table-wrap"><table class="table"><thead><tr><th>Staff</th><th>Category</th><th>Employment</th><th>Teaching</th><th>Access</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${rows}</tbody></table></div>
        <div class="pagination"><span>Showing ${results.length} of ${people.length} fictional records</span><div class="actions"><button class="btn secondary compact" disabled>Previous</button><button class="btn secondary compact" disabled>Next</button></div></div>`;
    }
  }
  return `${tabs("profiles")}
    <div class="page-head"><div><h1>Staff</h1></div><div class="actions"><button class="btn primary" onclick="go('add')">Add staff</button></div></div>
    <div class="directory-open"><form class="toolbar" onsubmit="applySearch(event)">
      <div class="control"><label for="by">Search attribute</label><select id="by" name="by"><option value="name"${selected(state.by, "name")}>Name</option><option value="employeeCode"${selected(state.by, "employeeCode")}>Employee code</option></select></div>
      <div class="control"><label for="q">Search staff</label><input id="q" name="q" value="${esc(state.query)}" placeholder="${state.by === "employeeCode" ? "e.g. EMP-1001" : "e.g. Avery Morgan"}"></div>
      <button class="btn secondary" type="button" onclick="drawer('filters')">Filters</button><button class="btn secondary" type="button" onclick="drawer('sort')">Sort</button>
    </form>${appliedSummary()}${body}</div>`;
}

function applySearch(event) {
  event.preventDefault();
  state.by = event.currentTarget.by.value;
  state.query = event.currentTarget.q.value;
  setScenario("populated");
  render();
}

function clearDirectoryQuery() {
  state.query = "";
  state.by = "name";
  state.filters = { category: "any", employment: "any", teaching: "any", access: "any" };
  setScenario("populated");
  render();
}

function add() {
  return `${tabs("profiles")}<div class="page-head"><div><button class="btn ghost" onclick="go('directory')">← Back to Staff</button><h1>Add staff</h1><p>Add the branch Staff profile first. Teaching responsibilities and sign-in access are reviewed separately.</p></div></div>
    <form class="card form-card" onsubmit="submitAdd(event)">
      <fieldset class="control" style="border:0;padding:0;margin:0 0 20px"><legend>School record</legend><label class="choice"><input type="radio" name="mode" value="new" checked onchange="toggleMode('new')">Create a new school record</label><label class="choice"><input type="radio" name="mode" value="existing" onchange="toggleMode('existing')">Use an existing school record ID</label></fieldset>
      <div id="new-person" class="form-grid"><div class="control"><label>First name</label><input name="first" placeholder="e.g. Morgan"></div><div class="control"><label>Last name</label><input name="last" placeholder="e.g. Patel"></div><div class="control span2" style="max-width:400px"><label>Contact email <span class="muted">(optional)</span></label><input type="email" name="email" placeholder="e.g. morgan.patel@example.test"><small>This contact detail does not change the sign-in address.</small></div></div>
      <div id="existing-person" hidden><div class="alert warn"><strong>Use the exact school record ID</strong>Name and email are not enough to confirm identity.</div><div class="form-grid section"><div class="control"><label>School record ID</label><input id="person-id" value="10000000-0000-4000-8000-000000000042"></div><div class="control" style="align-self:end"><button type="button" class="btn secondary" onclick="resolvePerson()">Find exact record</button></div><div id="candidate" class="span2" hidden></div></div></div>
      <div class="section"><h2>Employment</h2><p>Enter the branch employment details.</p><div class="form-grid"><div class="control"><label>Employee code</label><input name="code" placeholder="e.g. EMP-1042"></div><div class="control"><label>Category</label><select name="category"><option value="">Select category</option><option>Teaching</option><option>Administration</option><option>Support</option></select></div><div class="control"><label>Employed from</label><input name="from" type="date" value="2026-10-22"></div></div></div>
      <details class="section"><summary><strong>Optional next steps</strong></summary><p style="margin-top:12px">After saving, you can review teaching responsibilities and sign-in access from the Staff profile.</p></details><div id="add-feedback"></div>
      <div class="form-actions"><button type="button" class="btn secondary" onclick="go('directory')">Cancel</button><button class="btn primary" type="submit">Add staff</button></div>
    </form>`;
}

function toggleMode(mode) {
  document.querySelector("#new-person").hidden = mode !== "new";
  document.querySelector("#existing-person").hidden = mode !== "existing";
}

function resolvePerson() {
  const candidate = document.querySelector("#candidate");
  candidate.hidden = false;
  candidate.innerHTML = `<div class="card" style="padding:16px"><div class="person"><span class="avatar">RP</span><span><b>Riley Parker</b><small>School record …0042 · Contact ending @example.test</small></span></div><label class="choice" style="margin-top:12px"><input type="checkbox" required> I confirm this is the Staff member being added</label><div class="control"><label>Office verification reference</label><input placeholder="Non-sensitive office reference"></div></div>`;
}

function createFictionalStaff(form) {
  if (state.addSavedId) return people.find((person) => person.id === state.addSavedId);
  const first = form.first?.value.trim() || "Riley";
  const last = form.last?.value.trim() || "Parker";
  const person = {
    id: `emp-${1100 + people.length}`,
    name: `${first} ${last}`,
    code: form.code.value,
    category: form.category.value,
    employment: "Active",
    teaching: "Not enabled",
    access: "No account",
    initials: `${first[0] ?? "R"}${last[0] ?? "P"}`,
    contactEmail: form.email?.value || "",
    history: [{ at: todayLabel, text: "Staff profile added" }],
  };
  people.push(person);
  state.addSavedId = person.id;
  return person;
}

function submitAdd(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = document.querySelector("#add-feedback");
  if (!form.code.value || !form.category.value) {
    feedback.innerHTML = `<div class="alert bad"><strong>Check the form</strong>Employee code and category are required. Entered values have been kept.</div>`;
    form.code.focus();
    return;
  }
  if (state.scenario === "duplicate" || state.scenario === "rejected") {
    feedback.innerHTML = `<div class="alert bad"><strong>This Staff profile was not added</strong>An Employee with this code or school record is already linked to this branch. Review the existing profile before trying again.</div><button type="button" class="btn secondary" onclick="go('profile',{profile:people[0]})">Open existing profile</button>`;
    return;
  }
  if (state.scenario === "unknown") {
    feedback.innerHTML = `<div class="alert warn"><strong>We are still checking whether this profile was saved</strong>Do not submit the form again. Check the original request.</div><button type="button" class="btn secondary" onclick="recoverAdd('unknown')">Check saved result</button>`;
    return;
  }
  const savedPerson = createFictionalStaff(form);
  if (state.scenario === "refresh-failed") {
    feedback.innerHTML = `<div class="alert good"><strong>Staff profile saved</strong>The latest profile details could not be loaded. The save is confirmed.</div><button type="button" class="btn secondary" onclick="recoverAdd('refresh')">Refresh profile</button>`;
    return;
  }
  state.profileId = savedPerson.id;
  state.profileNotice = { tone: "good", title: "Staff profile saved", text: "The new Staff profile is ready for review." };
  setScenario("active");
  go("profile");
}

function recoverAdd(kind) {
  const form = document.querySelector("form");
  const savedPerson = kind === "unknown" ? createFictionalStaff(form) : people.find((person) => person.id === state.addSavedId);
  state.profileId = savedPerson.id;
  state.profileNotice = { tone: "good", title: "Staff profile saved", text: kind === "unknown" ? "The original request was found. No duplicate profile was created." : "Current profile details loaded without repeating the save." };
  setScenario("active");
  go("profile");
}

function historyPanel(person) {
  return `<section class="card"><div class="panel-head"><h2>Recent history</h2></div><ul class="history" style="padding:0 20px">${person.history.map((entry) => `<li><strong>${esc(entry.text)}</strong><time>${esc(entry.at)}</time></li>`).join("")}</ul></section>`;
}

function noticeMarkup(notice) {
  return notice ? `<div class="alert ${notice.tone}" style="margin:16px 0"><strong>${esc(notice.title)}</strong>${esc(notice.text)}</div>` : "";
}

function profile() {
  if (state.scenario === "ended") state.profileId = people[3].id;
  if (state.scenario === "no-account") state.profileId = people[2].id;
  const person = currentProfile();
  const ended = person.employment === "Ended";
  const showAssignment = !ended && !["end-eligible", "end-none", "end-no-membership", "end-no-membership-complete", "end-access-outcome-unknown", "end-access-confirmed", "end-employment-outcome-unknown", "end-complete", "end-revoked", "last-admin"].includes(state.scenario);
  return `${tabs("profiles")}<button class="btn ghost" onclick="go('directory')">← Back to Staff</button>
    <section class="card profile-head"><div class="profile-name"><span class="avatar">${person.initials}</span><div><h1>${esc(person.name)}</h1><p>${esc(person.code)} · ${esc(person.category)}</p></div></div><div class="actions"><span class="badge ${ended ? "" : "good"}">${person.employment}</span><button id="correct-details-trigger" class="btn secondary" onclick="drawer('correct')">Correct details</button></div></section>
    ${noticeMarkup(state.profileNotice)}
    <div class="profile-grid" style="margin-top:24px"><div class="stack"><section class="card"><div class="panel-head"><h2>Employment</h2>${!ended ? `<button id="end-employment-trigger" class="btn ghost compact" onclick="modal('end')">End employment</button>` : ""}</div><dl class="facts"><div><dt>Employee code</dt><dd>${esc(person.code)}</dd></div><div><dt>Category</dt><dd>${esc(person.category)}</dd></div><div><dt>Employed from</dt><dd>5 June 2024</dd></div><div><dt>Employed to</dt><dd>${ended ? "22 October 2026" : "Current"}</dd></div></dl></section>
      <section class="card"><div class="panel-head"><h2>Teaching & responsibilities</h2><button class="btn ghost compact" onclick="go('teaching')">Review eligibility</button></div><div class="rows"><div class="row"><div><h3>${esc(person.teaching)}</h3><p>${person.teaching.includes("Eligible") ? "5 June 2024 – no end date" : "No current teaching eligibility"}</p></div></div>${showAssignment ? `<div class="row"><div><h3>Mathematics · Grade 8A</h3><p>Current dated assignment</p></div><button class="btn ghost compact" onclick="go('teaching')">View</button></div>` : `<div class="row"><div><h3>No current or future assignments</h3><p>Existing class and Attendance history remains unchanged.</p></div></div>`}</div></section>${historyPanel(person)}</div>
      <aside class="stack compact-side"><section class="card"><div class="panel-head"><h2>Access</h2><button class="btn ghost compact" onclick="go('access')">Manage</button></div><div class="rows"><div class="row"><div><h3>${state.scenario === "no-account" || state.scenario === "end-no-membership" ? "No sign-in account" : esc(person.access)}</h3><p>${state.scenario === "no-account" || state.scenario === "end-no-membership" ? "No active branch membership needs to be changed." : "Contact email and sign-in address are managed separately."}</p></div></div></div></section>
      <section class="card"><div class="panel-head"><h2>Staff operations</h2></div><div class="handoff" style="padding:16px"><a href="#availability" onclick="go('availability')"><strong>Availability</strong><small>Record operational availability</small></a><a href="#cover" onclick="go('cover')"><strong>Cover</strong><small>Review a specific class period</small></a></div></section></aside></div>`;
}

function teaching() {
  const person = currentProfile();
  return `${tabs("profiles")}<button class="btn ghost" onclick="go('profile')">← Back to ${esc(person.name)}</button><div class="page-head"><div><h1>Teaching eligibility</h1><p>Review dates and current assignments before making a change.</p></div></div>
    <section class="card form-card">${noticeMarkup(state.teachingOutcome)}<div class="form-grid"><div class="control"><label>Eligible from</label><input id="eligible-from" type="date" value="2024-06-05"></div><div class="control"><label>Eligible until <span class="muted">(optional)</span></label><input id="eligible-until" type="date"></div><div class="control span2"><label>Reason</label><textarea id="eligibility-reason">Annual eligibility review confirmed by the school office.</textarea></div></div><div class="alert warn"><strong>Review one current assignment</strong>Mathematics · Grade 8A must remain within the selected dates. Existing class and Attendance history will not be changed.</div><div class="form-actions"><button class="btn secondary" onclick="go('profile')">Cancel</button><button class="btn primary" onclick="saveTeaching()">Review and save</button></div></section>`;
}

function saveTeaching() {
  const person = currentProfile();
  person.teaching = "Eligible to teach";
  addHistory(person, "Teaching eligibility dates reviewed");
  state.teachingOutcome = { tone: "good", title: "Teaching eligibility saved", text: "The current dates are shown below and the Staff history was updated." };
  render();
}

function access() {
  const person = currentProfile();
  const map = {
    "invite-pending": ["Invitation pending", "A current invitation is waiting for activation."],
    "invite-failed": ["Invitation delivery failed", "Delivery was not confirmed. Review the address before resending."],
    "invite-expired": ["Invitation expired", "A reviewed replacement can be sent when the address is confirmed."],
    "invite-consumed": ["Invitation used", "The Staff member has activated the account."],
    "invite-revoked": ["Invitation revoked", "This invitation is part of the history and cannot be restored."],
  };
  const entry = map[state.scenario] ?? [person.access, "Review the current branch access before making a change."];
  const canResend = ["invite-failed", "invite-expired"].includes(state.scenario);
  return `${tabs("access")}<button class="btn ghost" onclick="go('profile')">← Back to ${esc(person.name)}</button><div class="page-head"><div><h1>Staff access</h1><p>Review this Staff member’s sign-in setup and branch access.</p></div></div>${noticeMarkup(state.accessNotice)}
    <section class="card"><div class="panel-head"><h2>${esc(person.name)}</h2><span class="badge ${state.scenario === "invite-consumed" ? "good" : "warn"}">${entry[0]}</span></div><div class="rows"><div class="row"><div><h3>${entry[0]}</h3><p>${entry[1]}</p></div>${canResend ? `<button class="btn secondary compact" onclick="drawer('resend')">Review resend</button>` : `<span class="badge">${state.scenario === "invite-consumed" ? "Active" : "No resend"}</span>`}</div><div class="row"><div><h3>Branch roles</h3><p>Teacher</p></div><button class="btn ghost compact" onclick="drawer('roles')">Review</button></div><div class="row"><div><h3>Branch access</h3><p>${person.access}</p></div><button class="btn ghost compact" onclick="drawer('membership')">Review</button></div></div></section>`;
}

function availability() {
  return `${tabs("availability")}<div class="page-head"><div><h1>Availability</h1><p>Record operational availability for Staff you are permitted to manage.</p></div></div><section class="card form-card">${noticeMarkup(state.availabilityOutcome)}<div class="alert"><strong>Limited Staff information</strong>This does not record leave, medical details or payroll information.</div><div class="form-grid"><div class="control"><label>Staff member</label><select id="availability-person"><option>Avery Morgan · EMP-1001</option></select></div><div class="control"><label>Availability</label><select id="availability-value"><option>Busy</option><option>Free</option><option>Unknown</option></select></div><div class="control"><label>Starts</label><input type="datetime-local" value="2026-10-23T09:00"></div><div class="control"><label>Ends</label><input type="datetime-local" value="2026-10-23T11:00"></div></div><div class="form-actions"><button class="btn primary" onclick="saveAvailability()">Save availability</button></div></section>`;
}

function saveAvailability() {
  state.availabilityOutcome = { tone: "good", title: "Availability saved", text: "Avery Morgan is shown as busy from 09:00 to 11:00 on 23 October." };
  render();
}

function cover() {
  return `${tabs("profiles")}<div class="page-head"><div><h1>Cover handoff</h1><p>Review cover for one class period.</p></div></div><section class="card form-card">${state.coverOpened ? `<div class="alert good"><strong>Cover workflow ready</strong>The selected class period and current Teacher have been carried into the existing Cover workflow.</div>` : ""}<ul class="review-list"><li><span>Class period</span><strong>23 October · Period 2</strong></li><li><span>Class</span><strong>Grade 8A Mathematics</strong></li><li><span>Current Teacher</span><strong>Avery Morgan</strong></li><li><span>Availability</span><strong>Busy</strong></li></ul><div class="alert warn"><strong>Select cover in the dedicated workflow</strong>Only eligible Staff for this class period can be considered.</div><div class="form-actions"><button class="btn secondary" onclick="go('profile')">Back to profile</button><button class="btn primary" onclick="state.coverOpened=true;render()">Open Cover workflow</button></div></section>`;
}

function filtersDrawer() {
  const filter = state.filters;
  return `<div class="drawer-head"><div><h2>Filter Staff</h2><p class="muted">Changes apply only when you select Apply filters.</p></div><button class="icon-btn" onclick="closeOverlay()" aria-label="Close filters">×</button></div><div class="stack">
    <div class="control"><label>Category</label><select id="filter-category"><option value="any"${selected(filter.category, "any")}>Any category</option><option value="Teaching"${selected(filter.category, "Teaching")}>Teaching</option><option value="Administration"${selected(filter.category, "Administration")}>Administration</option><option value="Support"${selected(filter.category, "Support")}>Support</option></select></div>
    <div class="control"><label>Employment</label><select id="filter-employment"><option value="any"${selected(filter.employment, "any")}>Any status</option><option value="active"${selected(filter.employment, "active")}>Active</option><option value="ended"${selected(filter.employment, "ended")}>Ended</option></select></div>
    <div class="control"><label>Teaching</label><select id="filter-teaching"><option value="any"${selected(filter.teaching, "any")}>Any status</option><option value="eligible"${selected(filter.teaching, "eligible")}>Eligible</option><option value="not-enabled"${selected(filter.teaching, "not-enabled")}>Not enabled</option><option value="disabled"${selected(filter.teaching, "disabled")}>Disabled</option></select></div>
    <div class="control"><label>Access</label><select id="filter-access"><option value="any"${selected(filter.access, "any")}>Any status</option><option value="active"${selected(filter.access, "active")}>Active</option><option value="pending"${selected(filter.access, "pending")}>Pending invitation</option><option value="none"${selected(filter.access, "none")}>No account</option><option value="suspended"${selected(filter.access, "suspended")}>Suspended</option></select></div>
    <div class="form-actions"><button class="btn secondary" onclick="closeOverlay()">Cancel</button><button class="btn primary" onclick="applyFilters()">Apply filters</button></div></div>`;
}

function sortDrawer() {
  const sort = state.sort;
  return `<div class="drawer-head"><div><h2>Sort Staff</h2><p class="muted">Choose how Staff are ordered.</p></div><button class="icon-btn" onclick="closeOverlay()" aria-label="Close sort">×</button></div><fieldset class="control" style="border:0;padding:0"><legend>Sort by</legend>
    <label class="choice"><input type="radio" name="sort" value="name"${checked(sort.field, "name")}> Name</label><label class="choice"><input type="radio" name="sort" value="code"${checked(sort.field, "code")}> Employee code</label><label class="choice"><input type="radio" name="sort" value="employment"${checked(sort.field, "employment")}> Employment</label><label class="choice"><input type="radio" name="sort" value="teaching"${checked(sort.field, "teaching")}> Teaching</label><label class="choice"><input type="radio" name="sort" value="access"${checked(sort.field, "access")}> Access</label></fieldset>
    <fieldset class="control section" style="border:0;padding-top:20px"><legend>Order</legend><label class="choice"><input type="radio" name="order" value="asc"${checked(sort.order, "asc")}> Ascending</label><label class="choice"><input type="radio" name="order" value="desc"${checked(sort.order, "desc")}> Descending</label></fieldset><div class="form-actions"><button class="btn secondary" onclick="closeOverlay()">Cancel</button><button class="btn primary" onclick="applySort()">Apply sort</button></div>`;
}

function applyFilters() {
  state.filters = {
    category: document.querySelector("#filter-category").value,
    employment: document.querySelector("#filter-employment").value,
    teaching: document.querySelector("#filter-teaching").value,
    access: document.querySelector("#filter-access").value,
  };
  setScenario("populated");
  closeOverlay();
  render();
}

function applySort() {
  state.sort = {
    field: document.querySelector('input[name="sort"]:checked').value,
    order: document.querySelector('input[name="order"]:checked').value,
  };
  closeOverlay();
  render();
}

function correctionDraft() {
  if (!state.correctionDraft) {
    const person = currentProfile();
    const [firstName] = person.name.split(" ");
    state.correctionDraft = { firstName, contactEmail: person.contactEmail, code: person.code, category: person.category, personReason: "", employeeReason: "" };
  }
  return state.correctionDraft;
}

function correctionValues(section, draft = correctionDraft()) {
  return section === "person"
    ? { firstName: draft.firstName, contactEmail: draft.contactEmail, reason: draft.personReason }
    : { code: draft.code, category: draft.category, reason: draft.employeeReason };
}

function currentCorrectionValues(section, person = currentProfile()) {
  return section === "person"
    ? { firstName: person.name.split(" ")[0], contactEmail: person.contactEmail }
    : { code: person.code, category: person.category };
}

function captureCorrectionOperation(section) {
  const person = currentProfile();
  state.operationSequence += 1;
  return Object.freeze({
    section,
    targetId: person.id,
    submitted: Object.freeze({ ...correctionValues(section) }),
    expectedVersion: section === "person" ? person.personVersion : person.employeeVersion,
    requestKey: `review-${section}-${person.id}-${state.operationSequence}`,
  });
}

function comparisonMarkup(review) {
  if (!review) return "";
  const labels = review.operation.section === "person"
    ? { firstName: "First name", contactEmail: "Contact email" }
    : { code: "Employee code", category: "Category" };
  const rows = Object.keys(labels).map((field) => `<div class="comparison-row"><span>${labels[field]}</span><div><small>Current</small><strong>${esc(review.current[field])}</strong></div><div><small>Your change</small><strong>${esc(review.operation.submitted[field])}</strong></div></div>`).join("");
  return `<div class="comparison" aria-label="Current and attempted values">${rows}</div>`;
}

function correctionOutcomeMarkup() {
  const outcome = state.correctionOutcome;
  if (!outcome) return "";
  const actions = {
    rejected: `<button class="btn secondary compact" onclick="reviewRejectedCorrection()">Review fields</button>`,
    stale: `<button class="btn secondary compact" onclick="reviewStaleCorrection()">Review these values</button>`,
    unknown: `<button class="btn secondary compact" onclick="recoverCorrection('unknown')">Check saved result</button>`,
    refreshFailed: `<button class="btn secondary compact" onclick="recoverCorrection('refresh')">Refresh details</button>`,
  };
  const comparison = outcome.kind === "stale" || outcome.kind === "staleReviewed" ? comparisonMarkup(state.staleCorrection) : "";
  return `<div class="alert ${outcome.tone}"><strong>${esc(outcome.title)}</strong><p>${esc(outcome.text)}</p>${comparison}<div class="feedback-actions">${actions[outcome.kind] ?? ""}</div></div>`;
}

function correctionDrawer() {
  const draft = correctionDraft();
  const unresolvedSection = state.pendingCorrection?.status === "unknown" ? state.pendingCorrection.operation.section : null;
  const saveDisabled = unresolvedSection !== null;
  return `<div class="drawer-head"><div><h2>Correct Staff details</h2><p class="muted">Save personal and employment details separately.</p></div><button class="icon-btn" onclick="closeOverlay()" aria-label="Close corrections">×</button></div>${correctionOutcomeMarkup()}
    <section class="stack"><h3>Personal details</h3><div class="control"><label>First name</label><input id="person-first" value="${esc(draft.firstName)}" oninput="state.correctionDraft.firstName=this.value"></div><div class="control"><label>Contact email</label><input id="person-email" value="${esc(draft.contactEmail)}" oninput="state.correctionDraft.contactEmail=this.value"><small>This contact detail does not change the sign-in address.</small></div><div class="control"><label>Correction reason</label><textarea id="person-reason" oninput="state.correctionDraft.personReason=this.value">${esc(draft.personReason)}</textarea></div><button id="save-person" class="btn primary" onclick="saveSection('person')"${saveDisabled ? " disabled" : ""}>${unresolvedSection === "person" ? "Checking personal details" : "Save personal details"}</button></section>
    <section class="section stack"><h3>Employment details</h3><div class="control"><label>Employee code</label><input id="employee-code" value="${esc(draft.code)}" oninput="state.correctionDraft.code=this.value"></div><div class="control"><label>Category</label><select id="employee-category" onchange="state.correctionDraft.category=this.value"><option${selected(draft.category, "Teaching")}>Teaching</option><option${selected(draft.category, "Administration")}>Administration</option><option${selected(draft.category, "Support")}>Support</option></select></div><div class="control"><label>Correction reason</label><textarea id="employee-reason" oninput="state.correctionDraft.employeeReason=this.value">${esc(draft.employeeReason)}</textarea></div><button id="save-employee" class="btn primary" onclick="saveSection('employee')"${saveDisabled ? " disabled" : ""}>${unresolvedSection === "employee" ? "Checking employment details" : "Save employment details"}</button></section>`;
}

function saveSection(section) {
  if (state.pendingCorrection?.status === "unknown") {
    state.correctionOutcome = { kind: "unknown", tone: "warn", title: "We are still checking this change", text: "Check the pending change before saving another." };
    reopenDrawer("correct");
    return;
  }
  const operation = captureCorrectionOperation(section);
  if (state.scenario === "rejected") {
    state.pendingCorrection = null;
    state.correctionOutcome = { kind: "rejected", tone: "bad", title: "Change not saved", text: "The reason or new value needs attention. Your entries are still here." };
    reopenDrawer("correct");
    return;
  }
  if (state.scenario === "stale") {
    const person = currentProfile();
    if (section === "person") person.personVersion += 1;
    else person.employeeVersion += 1;
    state.pendingCorrection = null;
    state.staleCorrection = {
      operation,
      current: Object.freeze({ ...currentCorrectionValues(section, person) }),
      latestVersion: section === "person" ? person.personVersion : person.employeeVersion,
      reviewed: false,
    };
    state.correctionOutcome = { kind: "stale", tone: "warn", title: "Review the latest details", text: `Another authorized change was saved first. Compare the current record with your ${section === "person" ? "personal" : "employment"} change.` };
    reopenDrawer("correct");
    return;
  }
  if (state.scenario === "unknown") {
    state.pendingCorrection = { operation, status: "unknown", applied: false };
    state.correctionOutcome = { kind: "unknown", tone: "warn", title: "We are still checking this change", text: "Check the pending change before saving another." };
    reopenDrawer("correct");
    return;
  }
  applyCorrectionOperation(operation);
  if (state.scenario === "refresh-failed") {
    state.pendingCorrection = { operation, status: "refreshFailed", applied: true };
    state.correctionOutcome = { kind: "refreshFailed", tone: "good", title: "Details saved", text: "The latest profile could not be loaded. The confirmed save is retained." };
  } else {
    state.pendingCorrection = null;
    state.correctionOutcome = { kind: "saved", tone: "good", title: "Details saved", text: `The ${section === "person" ? "personal" : "employment"} details and history are updated. Your other unsaved entries remain.` };
  }
  reopenDrawer("correct");
}

function applyCorrectionOperation(operation) {
  if (state.appliedCorrectionKeys.has(operation.requestKey)) return false;
  const person = people.find((entry) => entry.id === operation.targetId);
  if (!person) return false;
  const draft = correctionDraft();
  if (operation.section === "person") {
    const surname = person.name.split(" ").slice(1).join(" ");
    person.name = `${operation.submitted.firstName || person.name.split(" ")[0]} ${surname}`.trim();
    person.contactEmail = operation.submitted.contactEmail;
    person.initials = person.name.split(" ").map((part) => part[0]).slice(0, 2).join("");
    person.personVersion += 1;
    addHistory(person, "Personal details corrected");
    draft.firstName = operation.submitted.firstName;
    draft.contactEmail = operation.submitted.contactEmail;
  } else {
    person.code = operation.submitted.code;
    person.category = operation.submitted.category;
    person.employeeVersion += 1;
    addHistory(person, "Employment details corrected");
    draft.code = operation.submitted.code;
    draft.category = operation.submitted.category;
  }
  state.appliedCorrectionKeys.add(operation.requestKey);
  return true;
}

function reviewRejectedCorrection() {
  setScenario("active");
  state.correctionOutcome = { kind: "review", tone: "warn", title: "Review your entries", text: "Update the highlighted details, then save again." };
  reopenDrawer("correct");
}

function reviewStaleCorrection() {
  if (!state.staleCorrection) return;
  state.staleCorrection.reviewed = true;
  setScenario("active");
  state.correctionOutcome = { kind: "staleReviewed", tone: "warn", title: "Latest details reviewed", text: "Your change is still in the form. Revise it or save it as a new change." };
  reopenDrawer("correct");
}

function recoverCorrection(kind) {
  const pending = state.pendingCorrection;
  if (!pending) return;
  if (kind === "unknown" && pending.status === "unknown") {
    applyCorrectionOperation(pending.operation);
    pending.status = "committed";
    pending.applied = true;
  }
  if (kind === "refresh" && pending.status === "refreshFailed") pending.status = "committed";
  setScenario("active");
  state.correctionOutcome = { kind: "saved", tone: "good", title: kind === "unknown" ? "Saved change found" : "Current details loaded", text: kind === "unknown" ? "The original change was found. No duplicate change was made." : "The profile now shows the confirmed saved details." };
  reopenDrawer("correct");
}

function resendDrawer() {
  return `<div class="drawer-head"><div><h2>Resend invitation</h2><p class="muted">Review the address and explain why a replacement is needed.</p></div><button class="icon-btn" onclick="closeOverlay()" aria-label="Close resend">×</button></div><div class="alert warn"><strong>Delivery was not confirmed</strong>The Staff member still has no active sign-in. A replacement will make the earlier invitation unusable.</div><div class="control"><label>Reason</label><textarea id="resend-reason">The Staff member confirmed the address and asked for a replacement invitation.</textarea></div><label class="choice"><input id="resend-confirm" type="checkbox"> I reviewed the Staff member and branch access</label><div id="resend-feedback"></div><div class="form-actions"><button class="btn secondary" onclick="closeOverlay()">Cancel</button><button class="btn primary" onclick="resendInvitation()">Resend invitation</button></div>`;
}

function resendInvitation() {
  if (!document.querySelector("#resend-confirm").checked || !document.querySelector("#resend-reason").value.trim()) {
    document.querySelector("#resend-feedback").innerHTML = `<div class="alert bad"><strong>Review required</strong>Confirm the Staff member and enter a reason.</div>`;
    return;
  }
  const person = currentProfile();
  person.access = "Pending invite";
  addHistory(person, "Replacement portal invitation prepared");
  state.accessNotice = { tone: "good", title: "Replacement invitation recorded", text: "The earlier invitation is no longer usable. Delivery remains pending until confirmed." };
  setScenario("invite-pending");
  closeOverlay();
  render();
}

function rolesDrawer() {
  return `<div class="drawer-head"><div><h2>Review branch roles</h2><p class="muted">Changing roles can affect what this Staff member can view or do.</p></div><button class="icon-btn" onclick="closeOverlay()" aria-label="Close roles">×</button></div><label class="choice"><input type="checkbox" checked> Teacher</label><label class="choice"><input type="checkbox"> School administrator</label><div class="alert warn"><strong>Consequences must be reviewed</strong>Removing a role can immediately remove access to protected work.</div><div class="form-actions"><button class="btn secondary" onclick="closeOverlay()">Cancel</button><button class="btn primary" onclick="saveRoles()">Save roles</button></div>`;
}

function saveRoles() {
  const person = currentProfile();
  addHistory(person, "Branch roles reviewed");
  state.accessNotice = { tone: "good", title: "Branch roles saved", text: "The profile history records the reviewed role change." };
  closeOverlay();
  render();
}

function membershipDrawer() {
  const person = currentProfile();
  return `<div class="drawer-head"><div><h2>Review branch access</h2><p class="muted">Suspending branch access takes effect on the next protected request.</p></div><button class="icon-btn" onclick="closeOverlay()" aria-label="Close branch access">×</button></div><ul class="review-list"><li><span>Current status</span><strong>${esc(person.access)}</strong></li><li><span>Other branches</span><strong>Not changed</strong></li><li><span>Account</span><strong>Remains available for other authorized relationships</strong></li></ul><div class="form-actions"><button class="btn secondary" onclick="closeOverlay()">Cancel</button><button class="btn danger" onclick="suspendAccess()">Suspend branch access</button></div>`;
}

function suspendAccess() {
  const person = currentProfile();
  person.access = "Suspended";
  addHistory(person, "Branch access suspended");
  state.accessNotice = { tone: "good", title: "Branch access suspended", text: "Other branches and account relationships are unchanged." };
  closeOverlay();
  render();
}

function drawer(kind) {
  if (!overlay.innerHTML) state.returnFocus = document.activeElement;
  const content = kind === "filters" ? filtersDrawer()
    : kind === "sort" ? sortDrawer()
      : kind === "correct" ? correctionDrawer()
        : kind === "resend" ? resendDrawer()
          : kind === "roles" ? rolesDrawer()
            : membershipDrawer();
  overlay.innerHTML = `<div class="backdrop" onclick="guardClose(event)"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="${kind}">${content}</aside>`;
  overlay.querySelector(".drawer button,.drawer input,.drawer select")?.focus();
}

function reopenDrawer(kind) {
  const focusId = state.returnFocus?.id;
  render();
  if (focusId) state.returnFocus = document.getElementById(focusId);
  drawer(kind);
}

const endStates = {
  "end-none": { tone: "warn", title: "No changes made", text: "No Staff or branch-access change has started.", action: "close", assignment: false },
  "end-assignment-blocked": { tone: "bad", title: "Resolve the current assignment first", text: "Mathematics · Grade 8A is still current. No employment or access change has started.", action: "review", assignment: true },
  "end-eligible": { tone: "warn", title: "Ready for final review", text: "No current or future assignment blocks this change.", action: "begin", assignment: false },
  "end-access-outcome-unknown": { tone: "warn", title: "Branch-access result still being checked", text: "Employment ending has not started. Check the original access change first.", action: "recoverAccess", assignment: false },
  "end-access-confirmed": { tone: "warn", title: "Branch access suspended; employment still active", text: "Continue only the remaining employment step after reviewing the current facts.", action: "continueEmployment", assignment: false },
  "end-employment-rejected": { tone: "bad", title: "Branch access suspended; employment still active", text: "A changed assignment now blocks employment ending. Review it before resuming this intent.", action: "review", assignment: true },
  "end-employment-outcome-unknown": { tone: "warn", title: "Branch access suspended; employment result still being checked", text: "Do not start another employment change. Check the original request.", action: "recoverEmployment", assignment: false },
  "end-complete": { tone: "good", title: "Employment ended and branch access suspended", text: "Other branches and unrelated account relationships were not changed.", action: "close", assignment: false },
  "end-no-membership": { tone: "warn", title: "No branch access change is needed", text: "There is no relevant active branch membership. Only employment will be ended.", action: "beginNoMembership", assignment: false },
  "end-no-membership-complete": { tone: "good", title: "Employment ended", text: "There was no active branch membership to suspend, so no access change was made.", action: "close", assignment: false },
  "end-revoked": { tone: "bad", title: "You no longer have access to recover this change", text: "Another currently authorized administrator must continue the same reviewed intent.", action: "close", assignment: false },
  "last-admin": { tone: "bad", title: "Branch access cannot be suspended", text: "Another active School administrator must be established before this change can start.", action: "close", assignment: false },
};

function ensureEmploymentIntent({ noMembership = false, accessStatus = "NOT_STARTED", employmentStatus = "NOT_STARTED" } = {}) {
  if (state.employmentEndIntent) return state.employmentEndIntent;
  state.operationSequence += 1;
  state.employmentEndIntent = {
    targetId: currentProfile().id,
    effectiveDate: "2026-10-22",
    access: noMembership ? "NOT_REQUIRED" : accessStatus,
    employment: employmentStatus,
    accessRequestKey: noMembership ? null : `review-access-${currentProfile().id}-${state.operationSequence}`,
    employmentRequestKey: `review-employment-${currentProfile().id}-${state.operationSequence}`,
    accessApplied: accessStatus === "COMMITTED",
    employmentApplied: employmentStatus === "COMMITTED",
  };
  return state.employmentEndIntent;
}

function employmentActionMarkup(action) {
  if (action === "begin") return `<button class="btn danger" onclick="startEmploymentEnd()">Suspend access and continue</button>`;
  if (action === "beginNoMembership") return `<button class="btn danger" onclick="startEmploymentEnd(true)">End employment</button>`;
  if (action === "review") return `<button class="btn primary" onclick="closeOverlay();go('teaching')">Review assignment</button>`;
  if (action === "recoverAccess") return `<button class="btn primary" onclick="recoverAccessSuspension()">Check branch-access result</button>`;
  if (action === "continueEmployment") return `<button class="btn danger" onclick="continueEmploymentEnd()">End employment</button>`;
  if (action === "recoverEmployment") return `<button class="btn primary" onclick="recoverEmploymentEnd()">Check employment result</button>`;
  return "";
}

function modal(kind) {
  if (kind !== "end") return;
  if (!overlay.innerHTML) state.returnFocus = document.activeElement;
  if (!endStates[state.scenario]) setScenario("end-none");
  const person = currentProfile();
  const endState = endStates[state.scenario];
  const accessText = state.scenario === "end-no-membership" || state.scenario === "end-no-membership-complete"
    ? "No active branch membership"
    : ["end-access-confirmed", "end-employment-rejected", "end-employment-outcome-unknown", "end-complete", "end-revoked"].includes(state.scenario)
      ? "Suspended"
      : state.scenario === "end-access-outcome-unknown" ? "Result unknown" : "Will be reviewed";
  const assignmentText = endState.assignment ? "Mathematics · Grade 8A · current" : "No current or future assignment";
  overlay.innerHTML = `<div class="backdrop"></div><section class="modal" role="dialog" aria-modal="true" aria-labelledby="end-title"><div class="drawer-head"><div><h2 id="end-title">End employment today?</h2><p class="muted">Review teaching responsibilities and branch access before continuing.</p></div><button class="icon-btn" onclick="closeOverlay()" aria-label="Close employment review">×</button></div><ul class="review-list"><li><span>Staff</span><strong>${esc(person.name)} · ${esc(person.code)}</strong></li><li><span>Effective date</span><strong>22 October 2026 · branch local</strong></li><li><span>Teaching</span><strong>Current eligibility will end</strong></li><li><span>Assignment review</span><strong>${assignmentText}</strong></li><li><span>Branch access</span><strong>${accessText}</strong></li></ul><div class="alert ${endState.tone}"><strong>${endState.title}</strong><p>${endState.text}</p></div>${["end-eligible", "end-no-membership"].includes(state.scenario) ? `<div class="control"><label>Reason</label><textarea>Employment ended following the confirmed school-office process.</textarea></div>` : ""}<div class="form-actions recovery-row"><button class="btn secondary" onclick="closeOverlay()">${endState.action === "close" ? "Close" : "Cancel"}</button>${employmentActionMarkup(endState.action)}</div></section>`;
  overlay.querySelector(".modal button")?.focus();
}

function applyAccessSuspension(intent) {
  if (intent.accessApplied || intent.access === "NOT_REQUIRED") return false;
  const person = people.find((entry) => entry.id === intent.targetId);
  person.access = "Suspended";
  intent.access = "COMMITTED";
  intent.accessApplied = true;
  addHistoryOnce(person, "Branch access suspended");
  return true;
}

function applyEmploymentEnd(intent) {
  if (intent.employmentApplied) return false;
  const person = people.find((entry) => entry.id === intent.targetId);
  person.employment = "Ended";
  person.teaching = "Disabled";
  intent.employment = "COMMITTED";
  intent.employmentApplied = true;
  const text = intent.access === "NOT_REQUIRED" ? "Employment ended; no branch access change was needed" : "Employment ended and branch access suspended";
  addHistoryOnce(person, text);
  return true;
}

function rerenderEmploymentModal(nextScenario) {
  setScenario(nextScenario);
  render();
  state.returnFocus = document.querySelector("main");
  modal("end");
}

function startEmploymentEnd(noMembership = false) {
  const intent = ensureEmploymentIntent({ noMembership });
  if (noMembership) {
    applyEmploymentEnd(intent);
    rerenderEmploymentModal("end-no-membership-complete");
    return;
  }
  applyAccessSuspension(intent);
  rerenderEmploymentModal("end-access-confirmed");
}

function recoverAccessSuspension() {
  const intent = ensureEmploymentIntent({ accessStatus: "UNKNOWN" });
  if (intent.access !== "UNKNOWN" && intent.access !== "COMMITTED") return;
  applyAccessSuspension(intent);
  rerenderEmploymentModal("end-access-confirmed");
}

function continueEmploymentEnd() {
  const intent = ensureEmploymentIntent({ accessStatus: "COMMITTED" });
  if (intent.access !== "COMMITTED") return;
  applyEmploymentEnd(intent);
  rerenderEmploymentModal("end-complete");
}

function recoverEmploymentEnd() {
  const intent = ensureEmploymentIntent({ accessStatus: "COMMITTED", employmentStatus: "UNKNOWN" });
  if (intent.access !== "COMMITTED") return;
  applyEmploymentEnd(intent);
  rerenderEmploymentModal("end-complete");
}

function guardClose(event) {
  if (event.target.classList.contains("backdrop")) closeOverlay();
}

function closeOverlay() {
  overlay.innerHTML = "";
  state.returnFocus?.focus?.();
  state.returnFocus = null;
}

function focusables() {
  return [...overlay.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')].filter((element) => !element.hidden);
}

function render() {
  const views = { directory, add, profile, teaching, access, availability, cover };
  main.innerHTML = (views[state.screen] ?? directory)();
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.textContent.trim() === "Staff"));
}

function closeMobileNavigation(returnFocus = true) {
  const sidebar = document.querySelector("#sidebar");
  if (!sidebar.classList.contains("open")) return;
  sidebar.classList.remove("open");
  document.querySelector("#menu").setAttribute("aria-expanded", "false");
  if (returnFocus) document.querySelector("#menu").focus();
}

document.querySelector("#theme").addEventListener("change", (event) => {
  document.documentElement.dataset.theme = event.target.value;
});

function resetEmploymentDemoPerson() {
  const person = people[0];
  person.employment = "Active";
  person.teaching = "Eligible to teach";
  person.access = "Active";
  person.history = person.history.filter((entry) => !["Branch access suspended", "Employment ended and branch access suspended", "Employment ended; no branch access change was needed"].includes(entry.text));
  state.profileId = person.id;
  state.employmentEndIntent = null;
}

scenarioSelect.addEventListener("change", (event) => {
  state.scenario = event.target.value;
  state.profileNotice = null;
  state.correctionOutcome = null;
  state.staleCorrection = null;
  if (["active", "ended", "no-account"].includes(state.scenario)) {
    state.screen = "profile";
    render();
  } else if (["rejected", "stale", "unknown", "refresh-failed"].includes(state.scenario)) {
    state.screen = "profile";
    render();
    setTimeout(() => drawer("correct"));
  } else if (state.scenario.startsWith("invite-")) {
    state.screen = "access";
    render();
  } else if (state.scenario.startsWith("end-") || state.scenario === "last-admin") {
    resetEmploymentDemoPerson();
    state.screen = "profile";
    const person = currentProfile();
    if (state.scenario === "end-no-membership") {
      person.access = "No account";
      ensureEmploymentIntent({ noMembership: true });
    } else if (state.scenario === "end-access-outcome-unknown") {
      ensureEmploymentIntent({ accessStatus: "UNKNOWN" });
    } else if (["end-access-confirmed", "end-employment-rejected", "end-employment-outcome-unknown", "end-complete", "end-revoked"].includes(state.scenario)) {
      person.access = "Suspended";
      const employmentStatus = state.scenario === "end-employment-outcome-unknown" ? "UNKNOWN" : "NOT_STARTED";
      const intent = ensureEmploymentIntent({ accessStatus: "COMMITTED", employmentStatus });
      if (state.scenario === "end-complete") applyEmploymentEnd(intent);
    }
    render();
    setTimeout(() => modal("end"));
  } else if (state.scenario === "duplicate") {
    state.screen = "add";
    render();
  } else {
    state.screen = "directory";
    render();
  }
});

document.querySelector("#menu").addEventListener("click", (event) => {
  const open = document.querySelector("#sidebar").classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
  if (open) document.querySelector("#close-menu").focus();
});
document.querySelector("#close-menu").addEventListener("click", () => closeMobileNavigation());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.innerHTML) {
    event.preventDefault();
    closeOverlay();
    return;
  }
  if (event.key === "Escape" && document.querySelector("#sidebar").classList.contains("open")) {
    event.preventDefault();
    closeMobileNavigation();
    return;
  }
  if (event.key === "Tab" && overlay.innerHTML) {
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

window.addEventListener("popstate", () => {
  state.screen = location.hash.slice(1) || "directory";
  render();
});

state.screen = location.hash.slice(1) || "directory";
render();
