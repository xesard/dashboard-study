const STORAGE_KEY = "study-tracker-projects";
const THEME_KEY = "study-tracker-theme";
const MAX_PROJECTS = 4;

const defaultProjects = [
  { id: 1, name: "AWS SysOps Associate", streak: 25, studiedToday: true },
  { id: 2, name: "Red Hat Certified Administrator", streak: 18, studiedToday: false },
  { id: 3, name: "Maestría en Ciberseguridad", streak: 9, studiedToday: false }
];

const cardGrid = document.getElementById("cardGrid");
const cardTemplate = document.getElementById("studyCardTemplate");
const addTemplate = document.getElementById("addCardTemplate");
const themeSelect = document.getElementById("themeSelect");

function loadProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultProjects;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : defaultProjects;
  } catch {
    return defaultProjects;
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
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

function buildBars(container) {
  const heights = [6, 10, 14, 22, 18, 26, 30];
  heights.forEach((h) => {
    const bar = document.createElement("i");
    bar.style.height = `${h}px`;
    container.appendChild(bar);
  });
}

function addProject() {
  const projects = loadProjects();
  if (projects.length >= MAX_PROJECTS) {
    alert("Solo puedes tener 4 proyectos activos.");
    return;
  }

  const name = prompt("Nombre del nuevo proyecto/certificación:");
  if (!name || !name.trim()) return;

  const nextId = projects.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const updated = [...projects, { id: nextId, name: name.trim(), streak: 0, studiedToday: false }];
  saveProjects(updated);
  render();
}

function removeProject(projectId) {
  const projects = loadProjects();
  const target = projects.find((item) => item.id === projectId);
  if (!target) return;

  const confirmed = confirm(`¿Quitar el proyecto "${target.name}"?`);
  if (!confirmed) return;

  const updated = projects.filter((item) => item.id !== projectId);
  saveProjects(updated);
  render();
}

function render() {
  const projects = loadProjects();
  cardGrid.innerHTML = "";

  projects.forEach((project) => {
    const node = cardTemplate.content.cloneNode(true);
    node.querySelector(".cert-name").textContent = project.name;
    node.querySelector(".days").textContent = `${project.streak} días`;

    const statusBanner = node.querySelector(".status-banner");
    const statusText = node.querySelector(".status-text");
    const statusIcon = node.querySelector(".status-icon");
    const actionButton = node.querySelector(".action-btn");
    const removeButton = node.querySelector(".remove-btn");

    if (project.studiedToday) {
      statusBanner.classList.add("done");
      statusText.innerHTML = "ESTUDIO DE HOY: <span style='color:#2d8e57'>COMPLETADO</span>";
      statusIcon.textContent = "✅";
      actionButton.textContent = "Ver detalles";
      actionButton.classList.remove("primary");
    } else {
      statusBanner.classList.add("pending");
      statusText.innerHTML = "ESTUDIO DE HOY: <span style='color:#7f8791'>PENDIENTE</span>";
      statusIcon.textContent = "⚪";
      actionButton.textContent = "Registrar estudio";
      actionButton.classList.add("primary");
    }

    actionButton.addEventListener("click", () => {
      if (!project.studiedToday) {
        const updated = projects.map((item) =>
          item.id === project.id ? { ...item, studiedToday: true, streak: item.streak + 1 } : item
        );
        saveProjects(updated);
        render();
      } else {
        alert(`${project.name}\n\nRacha actual: ${project.streak} días\n¡Buen trabajo hoy!`);
      }
    });

    removeButton.addEventListener("click", () => removeProject(project.id));

    buildBars(node.querySelector(".mini-bars"));
    cardGrid.appendChild(node);
  });

  if (projects.length < MAX_PROJECTS) {
    const addNode = addTemplate.content.cloneNode(true);
    const addCard = addNode.querySelector(".add-card");
    addCard.addEventListener("click", addProject);
    addCard.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        addProject();
      }
    });
    cardGrid.appendChild(addNode);
  }
}

themeSelect.addEventListener("change", (event) => saveTheme(event.target.value));

loadTheme();
render();
