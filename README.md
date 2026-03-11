# dashboard-study

Dashboard local para seguir rachas de estudio por certificación/hito.

## Ejecutar en local

```bash
python3 -m http.server 4173
```

Luego abre `http://localhost:4173` en tu navegador.

## Funcionalidades

- Vista tipo tablero con barra lateral y tarjetas de estudio.
- Estado diario por proyecto (completado/pendiente).
- Botón **Registrar estudio** que marca el día como completado y sube la racha.
- **Agregar y quitar proyectos** desde la interfaz (máximo 4 activos).
- **Selector de tema** claro/oscuro con persistencia local.
- Persistencia local en `localStorage` (sin autenticación, ideal para uso local).

## Diseño de interfaz (conceptos)

Se incluyeron 4 propuestas de layout UX/UI en:

- `DESIGN_CONCEPTS.md`
