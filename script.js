const STORAGE_KEY = "study-tracker-projects-v2";
const THEME_KEY = "study-tracker-theme";
const MAX_PROJECTS = 4;
const MAX_TASKS = 4;

const defaultProjects = [
  {
    id: 1,
    name: "AWS Security",
    streak: 12,
    tasks: [
      { id: 1, title: "Read chapter", done: true },
      { id: 2, title: "Practice labs", done: true },
      { id: 3, title: "Solve exam questions", done: false }
    ]
  },
  {
    id: 2,
    name: "OpenShift Administrator",
    streak: 6,
    tasks: [
      { id: 1, title: "Watch training video", done: true },
      { id: 2, title: "Lab scenario", done: false }
    ]
  }
];

const cardGrid = document.getElementById("cardGrid");
const cardTemplate = document.getElementById("studyCardTemplate");
const addTemplate = document.getElementById("addCardTemplate");
const themeSelect = document.getElementById("themeSelect");

const globalCompletion = document.getElementById("globalCompletion");
const globalProgressBar = document.getElementById("globalProgressBar");
const globalProgressLabel = document.getElementById("globalProgressLabel");

const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const projectForm = document.getElementById("projectForm");
const projectNameInput = document.getElementById("projectNameInput");
const taskInputs = Array.from(document.querySelectorAll(".task-input"));
const cancelModalBtn = document.getElementById("cancelModalBtn");

const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const resetBtn = document.getElementById("resetBtn");
const toast = document.getElementById("toast");

let editingProjectId = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function sanitizeProjects(data) {
  if (!Array.isArray(data)) return defaultProjects;
  return data.slice(0, MAX_PROJECTS).map((project, index) => {
    const tasks = Array.isArray(project.tasks)
      ? project.tasks.slice(0, MAX_TASKS).map((task, taskIndex) => ({
          id: Number(task.id) || taskIndex + 1,
          title: String(task.title || `Tarea ${taskIndex + 1}`).slice(0, 60),
          done: Boolean(task.done)
        }))
      : [];

    return {
      id: Number(project.id) || index + 1,
      name: String(project.name || `Proyecto ${index + 1}`).slice(0, 60),
      streak: Number(project.streak) || 0,
      tasks
    };
  });
}

function loadProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultProjects;
  try {
    return sanitizeProjects(JSON.parse(saved));
  } catch {
    return defaultProjects;
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeProjects(projects)));
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const theme = savedTheme === "dark" ? "dark" : "light";
  document.body.setAttribute("data-theme", theme);
  themeSelect.value = theme;
}

function saveTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

function calcProjectProgress(project) {
  const total = project.tasks.length;
  const done = project.tasks.filter((task) => task.done).length;
  const ratio = total ? Math.round((done / total) * 100) : 0;
  return { total, done, ratio };
}

function updateGlobalStats(projects) {
  const totals = projects.reduce(
    (acc, project) => {
      const { total, done } = calcProjectProgress(project);
      return { total: acc.total + total, done: acc.done + done };
    },
    { total: 0, done: 0 }
  );
  const ratio = totals.total ? Math.round((totals.done / totals.total) * 100) : 0;
  globalCompletion.textContent = `${totals.done}/${totals.total} tareas`;
  globalProgressBar.style.width = `${ratio}%`;
  globalProgressLabel.textContent = `${ratio}%`;
}

function openModal(project) {
  editingProjectId = project?.id ?? null;
  modalTitle.textContent = editingProjectId ? "Editar proyecto" : "Nuevo proyecto";

  projectNameInput.value = project?.name ?? "";
  taskInputs.forEach((input, index) => {
    input.value = project?.tasks?.[index]?.title ?? "";
  });

  projectModal.showModal();
  projectNameInput.focus();
}

function closeModal() {
  projectModal.close();
  projectForm.reset();
  taskInputs.forEach((input) => {
    input.value = "";
  });
  editingProjectId = null;
}

function upsertProjectFromModal() {
  const projects = loadProjects();
  const name = projectNameInput.value.trim();
  const taskTitles = taskInputs.map((input) => input.value.trim()).filter(Boolean).slice(0, MAX_TASKS);

  if (!name) {
    showToast("El nombre es obligatorio.");
    return;
  }

  if (!editingProjectId && projects.length >= MAX_PROJECTS) {
    showToast("Límite de 4 proyectos activos.");
    return;
  }

  const tasks = taskTitles.map((title, index) => ({ id: index + 1, title, done: false }));

  if (editingProjectId) {
    const updated = projects.map((project) =>
      project.id === editingProjectId
        ? {
            ...project,
            name,
            tasks: tasks.map((task) => ({
              ...task,
              done: project.tasks.find((old) => old.title === task.title)?.done ?? false
            }))
          }
        : project
    );
    saveProjects(updated);
    showToast("Proyecto actualizado.");
  } else {
    const nextId = projects.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    saveProjects([...projects, { id: nextId, name, streak: 0, tasks }]);
    showToast("Proyecto agregado.");
  }

  closeModal();
  render();
}

function removeProject(projectId) {
  const projects = loadProjects();
  const target = projects.find((project) => project.id === projectId);
  if (!target) return;
  if (!window.confirm(`¿Quitar "${target.name}"?`)) return;
  saveProjects(projects.filter((project) => project.id !== projectId));
  render();
  showToast("Proyecto eliminado.");
}

function toggleTask(projectId, taskId) {
  const projects = loadProjects();
  const updated = projects.map((project) => {
    if (project.id !== projectId) return project;

    const tasks = project.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task));
    const beforeDone = project.tasks.length > 0 && project.tasks.every((task) => task.done);
    const afterDone = tasks.length > 0 && tasks.every((task) => task.done);

    const streak = !beforeDone && afterDone ? project.streak + 1 : project.streak;
    return { ...project, tasks, streak };
  });

  saveProjects(updated);
  render();
}

function createTaskElement(project, task) {
  const li = document.createElement("li");
  li.className = `task-item${task.done ? " done" : ""}`;

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(project.id, task.id));

  const text = document.createElement("span");
  text.textContent = task.title;

  label.append(checkbox, text);
  li.append(label);
  return li;
}

function render() {
  const projects = loadProjects();
  cardGrid.innerHTML = "";

  projects.forEach((project) => {
    const node = cardTemplate.content.cloneNode(true);

    const certName = node.querySelector(".cert-name");
    const taskCounter = node.querySelector(".task-counter");
    const progress = node.querySelector(".project-progress");
    const taskList = node.querySelector(".task-list");
    const statusBanner = node.querySelector(".status-banner");
    const statusText = node.querySelector(".status-text");
    const statusIcon = node.querySelector(".status-icon");

    certName.textContent = project.name;

    const { total, done, ratio } = calcProjectProgress(project);
    taskCounter.textContent = `${done}/${total} tareas · Racha ${project.streak} días`;
    progress.style.width = `${ratio}%`;

    project.tasks.forEach((task) => taskList.append(createTaskElement(project, task)));
    if (project.tasks.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "Sin tareas todavía.";
      empty.className = "task-item";
      taskList.append(empty);
    }

    const completed = total > 0 && done === total;
    statusBanner.classList.add(completed ? "done" : "pending");
    statusText.textContent = completed ? "Estudio de hoy: COMPLETADO" : "Estudio de hoy: PENDIENTE";
    statusIcon.textContent = completed ? "✅" : "⏳";

    node.querySelector(".edit-btn").addEventListener("click", () => openModal(project));
    node.querySelector(".remove-btn").addEventListener("click", () => removeProject(project.id));

    cardGrid.append(node);
  });

  if (projects.length < MAX_PROJECTS) {
    const addNode = addTemplate.content.cloneNode(true);
    const addCard = addNode.querySelector(".add-card");
    addCard.addEventListener("click", () => openModal());
    addCard.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal();
      }
    });
    cardGrid.append(addNode);
  }

  updateGlobalStats(projects);
}

function exportData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    projects: loadProjects(),
    theme: document.body.getAttribute("data-theme") || "light"
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "xesar-tracker-backup.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Backup exportado.");
}

async function importData(file) {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const projects = sanitizeProjects(parsed.projects || parsed);
    saveProjects(projects);
    if (parsed.theme === "dark" || parsed.theme === "light") {
      saveTheme(parsed.theme);
    }
    render();
    showToast("Datos importados.");
  } catch {
    showToast("Archivo inválido.");
  }
}

function resetAll() {
  if (!window.confirm("Se borrarán todos los datos locales. ¿Continuar?")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(THEME_KEY);
  loadTheme();
  render();
  showToast("Datos reiniciados.");
}

themeSelect.addEventListener("change", (event) => saveTheme(event.target.value));
projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  upsertProjectFromModal();
});
cancelModalBtn.addEventListener("click", closeModal);
projectModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeModal();
});

exportBtn.addEventListener("click", exportData);
importInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importData(file);
  event.target.value = "";
});
resetBtn.addEventListener("click", resetAll);

loadTheme();
render();
