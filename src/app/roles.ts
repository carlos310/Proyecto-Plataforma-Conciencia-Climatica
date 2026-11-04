// Roles: cliente < empleado < admin. Cada nivel incluye lo del anterior.
// Las rutas (app.routes.ts) y el menú hamburguesa (navigation/menu.ts) comparten estas listas.
export const CLIENTE = ['cliente', 'empleado', 'admin'];
export const EMPLEADO = ['empleado', 'admin'];
export const ADMIN = ['admin'];
