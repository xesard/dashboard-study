const STORAGE_KEY = "study-tracker-projects";

const defaultProjects = [
  { id: 1, name: "AWS SysOps Associate", streak: 25, studiedToday: true },
  { id: 2, name: "Red Hat Certified Administrator", streak: 18, studiedToday: false },
  { id: 3, name: "Maestría en Ciberseguridad", streak: 9, studiedToday: false },
  { id: 4, name: "Linux Essentials", streak: 45, studiedToday: true }
];

const cardGrid = document.getElementById("cardGrid");
const cardTemplate = document.getElementById("studyCardTemplate");
const addTemplate = document.getElementById("addCardTemplate");

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

function buildBars(container) {
  const heights = [6, 10, 14, 22, 18, 26, 30];
  heights.forEach((h) => {
    const bar = document.createElement("i");
    bar.style.height = `${h}px`;
    container.appendChild(bar);
  });
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

    buildBars(node.querySelector(".mini-bars"));
    cardGrid.appendChild(node);
  });

  for (let i = 0; i < 2; i += 1) {
    cardGrid.appendChild(addTemplate.content.cloneNode(true));
  }
}

render();
