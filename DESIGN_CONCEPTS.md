# Xesar Tracker — 4 conceptos de interfaz (UX/UI)

Este documento propone **4 layouts diferentes** para un dashboard local de seguimiento de estudio.

## Contexto del producto

- Uso local, un solo usuario.
- Sin autenticación.
- Máximo **4 proyectos activos**.
- Máximo **4 tareas diarias por proyecto**.
- Objetivo: claridad, velocidad para marcar tareas y motivación diaria.

---

## Interface 1 — **Focus Cards Grid** (Card Dashboard)

### Descripción del concepto
Un tablero de tarjetas grandes y limpias para ver de un vistazo el estado de cada proyecto. Ideal para quienes prefieren una visión visual tipo "panel".

### Cómo se muestran los proyectos
- Grid 2x2 de tarjetas (hasta 4).
- Cada tarjeta representa un proyecto.
- Encabezado con nombre del proyecto y etiqueta breve de estado (On track / Atrasado).

### Cómo se muestran las tareas
- Dentro de cada tarjeta: checklist de hasta 4 tareas del día.
- Cada tarea con checkbox grande para marcar rápido.

### Cómo se visualiza el progreso
- Barra de progreso por tarjeta (0–100% de tareas del día).
- KPI superior: "Tareas completadas hoy" global.

### ASCII wireframe

```text
+--------------------------------------------------------------------------------+
| Xesar Tracker                                         Hoy: 10/12 tareas (83%)  |
+--------------------------------------------------------------------------------+
| [ Proyecto 1 ]              | [ Proyecto 2 ]                                  |
| AWS Security    On track    | OpenShift Admin    Atrasado                     |
| [███████---] 3/4 tareas     | [████------] 2/4 tareas                         |
| ☑ Read chapter              | ☑ Watch video                                   |
| ☑ Labs                      | ☐ Practice labs                                 |
| ☑ 20 exam questions         | ☑ Notes review                                  |
| ☐ Flashcards                | ☐ Mock exam                                     |
+-----------------------------+--------------------------------------------------+
| [ Proyecto 3 ]              | [ Proyecto 4 ]                                  |
| CEH                         | Kubernetes                                      |
| [████████--] 3/4            | [███-------] 1/4                                |
| ...                         | ...                                             |
+--------------------------------------------------------------------------------+
```

---

## Interface 2 — **Study Flow Board** (Kanban Study Board)

### Descripción del concepto
Un enfoque estilo Kanban donde cada columna es un proyecto y las tareas se mueven visualmente de pendiente a completado dentro de la misma columna (sin complejidad de drag & drop obligatorio).

### Cómo se muestran los proyectos
- 4 columnas máximo, una por proyecto.
- Encabezado de columna con nombre y mini progreso del día.

### Cómo se muestran las tareas
- Bloques de tareas agrupados por estado:
  - Pendientes
  - Completadas
- Acción simple: botón/check para cambiar de estado.

### Cómo se visualiza el progreso
- Indicador "x/4" por columna.
- Línea de progreso horizontal en el header de la columna.

### ASCII wireframe

```text
+--------------------------------------------------------------------------------------------------+
| Xesar Tracker — Study Flow Board                                                                 |
+--------------------------------------------------------------------------------------------------+
| AWS Security        | OpenShift Admin     | CEH                  | Kubernetes                    |
| 2/4 [█████-----]    | 3/4 [███████---]    | 1/4 [███-------]     | 4/4 [██████████]             |
|---------------------|---------------------|----------------------|-------------------------------|
| Pendientes          | Pendientes          | Pendientes           | Pendientes                    |
| ☐ Labs              | ☐ Mock exam         | ☐ Read chapter       | (vacío)                       |
| ☐ Flashcards        |                     | ☐ Labs               |                               |
|---------------------|---------------------|----------------------|-------------------------------|
| Completadas         | Completadas         | Completadas          | Completadas                   |
| ☑ Read chapter      | ☑ Video             | ☑ Video              | ☑ Read chapter                |
| ☑ Questions         | ☑ Labs              |                      | ☑ Labs                        |
|                     | ☑ Notes             |                      | ☑ Video                       |
|                     |                     |                      | ☑ Questions                   |
+--------------------------------------------------------------------------------------------------+
```

---

## Interface 3 — **Progress Pulse** (Progress Tracker Layout)

### Descripción del concepto
Diseño centrado en métricas y avance diario. Prioriza motivación por progreso acumulado y consistencia.

### Cómo se muestran los proyectos
- Lista compacta de proyectos en panel izquierdo.
- Al seleccionar uno, el panel derecho muestra detalle de tareas y avance.

### Cómo se muestran las tareas
- Checklist del proyecto activo con 4 tareas máximo.
- Toggle inmediato por tarea.

### Cómo se visualiza el progreso
- Hero superior con:
  - Progreso total del día.
  - Racha de días.
  - Proyectos completados hoy.
- Barra de progreso por proyecto en la lista lateral.

### ASCII wireframe

```text
+--------------------------------------------------------------------------------+
| Xesar Tracker — Progress Pulse                                                 |
| Hoy: 10/16 tareas | Racha: 12 días | Proyectos al día: 2/4                    |
| Progreso global: [███████-----] 62%                                           |
+------------------------------+-------------------------------------------------+
| Proyectos                    | Proyecto activo: AWS Security                   |
|------------------------------|-------------------------------------------------|
| > AWS Security   3/4 [███-]  | Tareas de hoy                                  |
|   OpenShift      2/4 [██--]  | ☑ Read chapter                                 |
|   CEH            1/4 [█---]  | ☑ Labs                                         |
|   Kubernetes     4/4 [████]  | ☑ Questions                                    |
|                              | ☐ Flashcards                                   |
|                              |                                                 |
|                              | Acción: [Marcar todo] [Reset día]              |
+--------------------------------------------------------------------------------+
```

---

## Interface 4 — **Quick Tick List** (Minimalist Study List)

### Descripción del concepto
Enfoque ultra minimalista para marcar tareas en segundos. Menos componentes, máximo foco en ejecución diaria.

### Cómo se muestran los proyectos
- Lista vertical de bloques plegables (accordion) para hasta 4 proyectos.
- Cada bloque muestra resumen "completadas/total".

### Cómo se muestran las tareas
- Al expandir un proyecto: checklist simple de 4 tareas.
- Área táctil grande para check rápido.

### Cómo se visualiza el progreso
- Header con una sola métrica principal: "% del día".
- Microtexto por proyecto: "3 de 4 completadas".

### ASCII wireframe

```text
+-------------------------------------------------------------------+
| Xesar Tracker                               Progreso hoy: 62%      |
+-------------------------------------------------------------------+
| ▼ AWS Security                         3/4 completadas             |
|   ☑ Read chapter                                                [ ]|
|   ☑ Labs                                                        [ ]|
|   ☑ Questions                                                   [ ]|
|   ☐ Flashcards                                                  [ ]|
|-------------------------------------------------------------------|
| ▶ OpenShift Administrator              2/4 completadas             |
|-------------------------------------------------------------------|
| ▶ CEH                                  1/4 completadas             |
|-------------------------------------------------------------------|
| ▶ Kubernetes                           4/4 completadas             |
+-------------------------------------------------------------------+
```

---

## Recomendación rápida

Si el objetivo principal es **motivación + claridad visual**, elegir **Interface 1 (Focus Cards Grid)**.

Si el objetivo principal es **operación rápida diaria con mínima fricción**, elegir **Interface 4 (Quick Tick List)**.
