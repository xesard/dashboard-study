# dashboard-study

Dashboard local para seguir rachas de estudio por certificación/hito.

## Ejecutar en local

```bash
python3 -m http.server 4173
```

Luego abre `http://localhost:4173` en tu navegador.

## Funcionalidades

- Hasta **4 proyectos** activos.
- Hasta **4 tareas diarias** por proyecto con estado pendiente/completada.
- Progreso por proyecto y progreso global del día.
- Crear, editar y eliminar tarjetas/proyectos.
- Selector de tema claro/oscuro con persistencia local.
- Exportar/Importar backup JSON y reset total.
- Persistencia local en `localStorage` (sin autenticación).

## Diseño de interfaz (conceptos)

Se incluyeron 4 propuestas de layout UX/UI en:

- `DESIGN_CONCEPTS.md`
