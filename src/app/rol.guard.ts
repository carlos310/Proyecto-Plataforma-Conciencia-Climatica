import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getRol, hasSession } from '../../src/infrastructure/adapter/authService.js';

// Protege una ruta según el rol del token. Las rutas declaran data: { roles: [...] }
export const rolGuard: CanActivateFn = (route) => {
  // En el render del servidor no hay localStorage; la decisión se toma en el navegador
  if (typeof localStorage === 'undefined') return true;

  const router = inject(Router);
  const roles: string[] = route.data['roles'] ?? [];
  if (!hasSession()) return router.createUrlTree(['/login']);
  return roles.includes(getRol() ?? '') ? true : router.createUrlTree(['/']);
};
