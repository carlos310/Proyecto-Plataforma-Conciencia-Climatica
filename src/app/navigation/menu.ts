import { ADMIN, CLIENTE, EMPLEADO } from '../roles';

// Un enlace existe solo si su ruta ya está en app.routes.ts. Las opciones "Ver ingresos/gastos/costos/compras"
// no tienen ruta en el proyecto, por eso no aparecen aquí.
export interface EnlaceMenu {
  etiqueta: string;
  ruta: string;
  icono?: string;
  // Sin roles: visible para cualquiera. Con roles: solo si el rol del token está en la lista.
  roles?: string[];
  // true: solo se muestra cuando NO hay sesión (Sign In / Log In).
  soloSinSesion?: boolean;
}

export interface SeccionMenu {
  id: string;
  titulo: string;
  enlaces: EnlaceMenu[];
}

export const ENLACES_PRINCIPALES: EnlaceMenu[] = [
  { etiqueta: 'Inicio', ruta: '/', icono: '/assets/iconos/water-drop-white.png' },
  { etiqueta: 'Amenazas', ruta: '/amenazas', icono: '/assets/iconos/warning-white.png' },
  { etiqueta: 'Ventas', ruta: '/ventas', icono: '/assets/iconos/partner-heart.png' },
  { etiqueta: 'Recursos Hídricos', ruta: '/recursosHidricos', icono: '/assets/iconos/water-white.png' },
  { etiqueta: 'Sign In', ruta: '/signIn', icono: '/assets/iconos/corrections-white.png', soloSinSesion: true },
  { etiqueta: 'Log In', ruta: '/login', icono: '/assets/iconos/corrections-white.png', soloSinSesion: true },
];

export const SECCIONES_MENU: SeccionMenu[] = [
  {
    id: 'ingresos',
    titulo: 'Ingresos',
    enlaces: [
      { etiqueta: 'Crear ingreso', ruta: '/ingresos-create', roles: EMPLEADO },
      { etiqueta: 'Editar ingreso', ruta: '/ingresos-edit', roles: ADMIN },
      { etiqueta: 'Eliminar ingreso', ruta: '/ingresos-delete', roles: ADMIN },
    ],
  },
  {
    id: 'gastos',
    titulo: 'Gastos',
    enlaces: [
      { etiqueta: 'Crear gasto', ruta: '/gastos-create', roles: EMPLEADO },
      { etiqueta: 'Editar gasto', ruta: '/gastos-edit', roles: ADMIN },
      { etiqueta: 'Eliminar gasto', ruta: '/gastos-delete', roles: ADMIN },
    ],
  },
  {
    id: 'costos',
    titulo: 'Costos',
    enlaces: [
      { etiqueta: 'Crear costo', ruta: '/costos-create', roles: EMPLEADO },
      { etiqueta: 'Editar costo', ruta: '/costos-edit', roles: ADMIN },
      { etiqueta: 'Eliminar costo', ruta: '/costos-delete', roles: ADMIN },
    ],
  },
  {
    id: 'compras',
    titulo: 'Compras',
    enlaces: [
      { etiqueta: 'Crear compra', ruta: '/compras-productos-create', roles: EMPLEADO },
      { etiqueta: 'Editar compra', ruta: '/compras-productos-edit', roles: ADMIN },
      { etiqueta: 'Eliminar compra', ruta: '/compras-productos-delete', roles: ADMIN },
    ],
  },
  {
    id: 'productos',
    titulo: 'Productos',
    enlaces: [
      { etiqueta: 'Ver productos', ruta: '/productosDashboard', roles: CLIENTE },
      { etiqueta: 'Crear producto', ruta: '/ingresarProductos', roles: EMPLEADO },
      { etiqueta: 'Editar producto', ruta: '/editarProductos', roles: ADMIN },
      { etiqueta: 'Eliminar producto', ruta: '/borrarProductos', roles: ADMIN },
    ],
  },
];

// Devuelve solo los enlaces que el usuario puede usar según sesión y rol.
// Es la misma regla que aplica rolGuard, así el menú no ofrece rutas que terminarían redirigiendo.
export function enlacesVisibles(enlaces: EnlaceMenu[], hayAcceso: boolean, rol: string | null): EnlaceMenu[] {
  return enlaces.filter((enlace) => {
    if (enlace.soloSinSesion) return !hayAcceso;
    if (enlace.roles) return enlace.roles.includes(rol ?? '');
    return true;
  });
}

// Oculta las secciones que quedan vacías (por ejemplo, un cliente no ve Ingresos ni Gastos).
export function seccionesVisibles(secciones: SeccionMenu[], rol: string | null): SeccionMenu[] {
  return secciones
    .map((seccion) => ({ ...seccion, enlaces: enlacesVisibles(seccion.enlaces, true, rol) }))
    .filter((seccion) => seccion.enlaces.length > 0);
}
