---
name: nuevo-modulo
description: Implementa un nuevo módulo CRUD del panel (interfaces, service, schema zod, componentes y página) siguiendo como referencia el módulo de categorías. Úsala cuando el usuario pida crear/implementar un nuevo módulo, pantalla de gestión o CRUD (p. ej. "implementa el módulo de clientes", "/nuevo-modulo administradores").
argument-hint: <nombre del módulo> [endpoint de la API / campos]
---

# Nuevo módulo (referencia: categorías)

Módulo a implementar: **$ARGUMENTS**

El módulo de **categorías** es la referencia canónica. Antes de escribir código, **lee estos archivos** y replica su estructura, nombres, comentarios e idioms (Svelte 5 runes, imports con alias `#lib/...index.ts`, textos en español):

| Capa           | Archivo de referencia                                           |
| -------------- | --------------------------------------------------------------- |
| Interfaces     | `src/lib/interfaces/categoria.interface.ts`                     |
| Service        | `src/lib/services/categoria.service.ts`                         |
| Validación zod | `src/lib/zod/categoria.schema.ts`                               |
| Componentes    | `src/lib/components/features/panel/categorias/*` (+ `index.ts`) |
| Skeletons      | `src/lib/components/skeletons/` (+ `index.ts`)                  |
| Página         | `src/routes/panel/categorias/+page.svelte`                      |
| Menú           | `src/lib/config/navigation.config.ts`                           |
| Permisos       | `src/lib/config/permissions.config.ts`, `routeAccess.config.ts` |

Si falta información (endpoint, campos, tipos, qué campos son opcionales, si hay delete), **pregunta antes de implementar**. Si el usuario pegó la respuesta/spec de la API, derívala de ahí.

## 1. Interfaces — `src/lib/interfaces/<entidad>.interface.ts`

- `<Entidad>` (lo que devuelve el listado), `<Entidad>Detail extends <Entidad>` (con auditoría: `is_deleted`, `created_at`, `created_by`, `updated_at`, `updated_by`) si la API la devuelve.
- `<Entidad>ListParams = PaginationParams`, `<Entidad>ListResponse = PaginatedResponse<<Entidad>>` desde `./pagination.interface`.
- `Create<Entidad>Request` y `Update<Entidad>Request = Partial<Create...>` (PATCH solo con campos modificados).
- Campos opcionales de la API como `string | null`. JSDoc corto en campos no obvios.
- Exportar en `src/lib/interfaces/index.ts`.

## 2. Service — `src/lib/services/<entidad>.service.ts`

- Clase `<Entidad>Service` + instancia exportada `<entidad>Service`.
- Usa `apiFidelityTupa` de `#lib/config/index.ts` con `{ requireAuth: true }`.
- `list` usa `buildPaginationQuery` de `#lib/utils/pagination.ts`.
- IDs en URL con `encodeURIComponent`. `delete` devuelve `Promise<void>` (204).
- Exportar en `src/lib/services/index.ts`.

## 3. Validación — `src/lib/zod/<entidad>.schema.ts`

- Constantes de longitud exportadas (`<ENTIDAD>_<CAMPO>_MAX`) para reutilizarlas en contadores de la UI.
- Strings con `.trim()`, `.nonempty({ message })`, `.max(...)`; mensajes en español.
- Opcionales: `.transform((value) => value || null)` (texto vacío → `null`).
- `create<Entidad>Schema`, `update<Entidad>Schema` y `type Create<Entidad>Input = z.input<...>`.
- Validar en el componente con `validateSchema` de `#lib/utils/index.ts` → `fieldErrors = result.errors`.
- Exportar en `src/lib/zod/index.ts`.

## 4. Componentes — `src/lib/components/features/panel/<entidades>/`

Archivos en camelCase, igual que categorías:

- `<entidad>List.svelte` — estados: error sin datos (con Reintentar), carga inicial con `<Entidad>ListSkeleton` (ver sección 4.1, **no** skeleton inline), vacío, error con datos (banner), cards en móvil (`md:hidden`) + tabla en `md+`, `Pagination` y `Select` de "por página" con `PAGINATION.PER_PAGE_OPTIONS`.
- `<entidad>Table.svelte` + `<entidad>Row.svelte` — `Table, TableBody, TableHead, TableHeader, TableRow, TableCell`.
- `<entidad>Card.svelte` — vista móvil.
- `<entidad>Actions.svelte` — `DropdownMenu` con opciones `DropdownOption[]` (Editar / Eliminar).
- `<entidad>FormModal.svelte` — `Modal` + `Input`/`TextArea`/`Select`; crea o edita según prop; en edición calcula `changes` (diff) y deshabilita guardar sin cambios; `alert('success', ...)`; errores con `errorService.getMessage(error)`; no cierra mientras `isLoading`.
- `<entidad>DeleteModal.svelte` — `ModalConfirm`.
- `index.ts` barrel exportando todos.

Reglas:

- **Reutiliza siempre** `#lib/components/ui/index.ts` (Button, Input, TextArea, Select, Modal, ModalConfirm, DropdownMenu, Pagination, PageHeader, Table*, Badge, Card…) y los iconos de `#lib/icons/outline/index.ts, #lib/icons/solid/index.ts`. No crees componentes UI nuevos si ya existe uno; si hace falta uno genérico, va en `ui/`, no en el feature.
- Mismas clases de tema (`text-light-two dark:text-dark-two`, `border-light-one_d dark:border-dark-one_d`, etc.) que en categorías.

### 4.1 Skeleton loader — `src/lib/components/skeletons/<entidad>ListSkeleton.svelte`

Cada módulo tiene su skeleton en `src/lib/components/skeletons/`, **no** dentro del feature ni inline en el List. Referencia: `src/lib/components/skeletons/categoriaListSkeleton.svelte`.

- Debe ser **responsivo y reflejar el layout real** del List para que no haya salto visual al cargar:
  - Móvil/tablet pequeña: grid de cards igual que el List (`grid gap-3 p-3 sm:grid-cols-2 md:hidden`), con la misma forma que `<entidad>Card` (icono/avatar, líneas de título/subtítulo/descripción, botón de acciones).
  - `md+`: tabla (`hidden md:block`) con cabecera y filas que imiten las columnas de `<entidad>Table`/`<entidad>Row` (mismos anchos de columna, celda de acciones de `w-14`). Columnas que en la tabla real se ocultan por breakpoint (`hidden lg:table-cell`, etc.) se ocultan igual en el skeleton.
- Bloques con `animate-pulse` y `bg-light-one_d dark:bg-dark-one_d`, bordes redondeados como el elemento que representan; anchos variados entre filas para que se vea natural.
- Prop `items?: number` (por defecto 5) para el número de filas/cards.
- Accesibilidad: contenedor con `role="status"`, `aria-label="Cargando <entidades>"` y un `<span class="sr-only">Cargando…</span>`; los bloques decorativos con `aria-hidden="true"`.
- Exportarlo en `src/lib/components/skeletons/index.ts` (crear el barrel si no existe: `export { default as <Entidad>ListSkeleton } from './<entidad>ListSkeleton.svelte';`).
- Usarlo en `<entidad>List.svelte` importando desde `#lib/components/skeletons/index.ts` en la rama `{:else if isInitialLoading}`.
- Si el formulario o una vista de detalle cargan datos asíncronos, crear también su skeleton (`<entidad>FormSkeleton.svelte`, `<entidad>DetailSkeleton.svelte`) con las mismas reglas.

## 5. Formateo de datos — `src/lib/utils/format.ts`

Nunca muestres datos crudos que puedan ser nulos/vacíos ni formatees a mano. Usa (importando de `#lib/utils/index.ts`):

- `formatValue` — textos/valores genéricos (null o vacío → `NO_DATA_LABEL`).
- `formatNumber`, `formatDecimal` (decimales que vienen como string), `formatCurrency` (BOB por defecto).
- `formatDate`, `formatDateTime` — fechas ISO de la API.
- `formatBoolean` — con `trueLabel`/`falseLabel` si aplica.
  Si se necesita un formateador nuevo, agrégalo en `format.ts` siguiendo el mismo patrón (`fallback` con `NO_DATA_LABEL`).

## 6. Página — `src/routes/panel/<entidades>/+page.svelte`

Copia la estructura de la página de categorías: `MainLayout` + `PageHeader` con botón "Nuevo/a …", estado de paginación con `PAGINATION`, `lastRequestId` contra respuestas fuera de orden, `handleSaved`/`handleDeleted` que actualizan la lista localmente, y recarga de la página anterior si queda vacía.

## 7. Navegación

Si la ruta no está ya en `src/lib/config/navigation.config.ts`, agrégala en el grupo que corresponda con `navItem({ id, label, route: '/panel/<entidades>', icon })` y un icono de `#lib/icons/outline`. El sidebar se filtra solo según el rol.

## 8. Permisos

El acceso se controla en dos capas; nunca compares roles a mano (`role === 'ADMIN'`) en componentes.

- **Módulo** — `src/lib/config/permissions.config.ts` es espejo de `shared/services/permissions.py` del backend. Si el módulo es nuevo, agrégalo a `Module` y dale acciones en `ROLE_PERMISSIONS` igual que el backend (los administradores lo reciben por `fullAccess()`). Pregunta al usuario si no conoces los permisos del backend.
- **Página** — `src/lib/config/routeAccess.config.ts`. Los administradores ven todo `/panel` automáticamente; para cualquier otro rol que deba abrir la página, agrega la ruta a sus `routes` en `ROLE_ACCESS`. Si no, el guard de `src/routes/panel/+layout.ts` lo redirige a su inicio.
- **Botones y opciones** — en la página: `const canCreate = $derived(can($currentRole, Module.X, Action.CREATE))` (igual para UPDATE/DELETE), con `can` de `#lib/utils/index.ts` y `currentRole` de `#lib/stores/index.ts`.
  - Botón "Nuevo": `{#snippet createButton()}…{/snippet}` + `<PageHeader actions={canCreate ? createButton : undefined} />`.
  - Handlers: pasar solo si hay permiso (`onEdit={canUpdate ? openEdit : undefined}`). En `<entidad>Actions.svelte` los handlers son opcionales y solo se listan las opciones recibidas; si no queda ninguna, no se renderiza el botón ⋮. `<entidad>Table/Row/Card` ocultan la columna de acciones si no llega ningún handler (ver `categoriaActions.svelte`, `categoriaRow.svelte`).
  - Para envolver markup suelto: `<Can module={Module.X} action={Action.CREATE}>…</Can>` de `#lib/components/auth/index.ts`.
- Estas reglas solo ocultan UI; la seguridad real la aplica el backend.

## Al terminar

- Ejecuta `pnpm check` (svelte-check) y `pnpm lint` y corrige errores.
- Resume los archivos creados/modificados y cualquier supuesto sobre la API.
