import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterModule} from '@angular/router';
import { getRol, hasSession } from '../../../../src/infrastructure/adapter/authService.js';
import { ENLACES_PRINCIPALES, EnlaceMenu, SECCIONES_MENU, SeccionMenu, enlacesVisibles, seccionesVisibles } from '../../navigation/menu';


@Component({
  selector: 'app-header',
  imports: [RouterModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  @ViewChild('botonMenu') botonMenu?: ElementRef<HTMLButtonElement>;

  menuAbierto = false;
  seccionAbierta: string | null = null;

  constructor(private host: ElementRef<HTMLElement>) {}

  get isLoggedIn(): boolean {
    return hasSession();
  }

  // Las reglas de visibilidad viven en navigation/menu.ts; aquí solo se consulta el estado de sesión y rol
  get enlacesPrincipales(): EnlaceMenu[] {
    return enlacesVisibles(ENLACES_PRINCIPALES, this.isLoggedIn, getRol());
  }

  get secciones(): SeccionMenu[] {
    return seccionesVisibles(SECCIONES_MENU, getRol());
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    if (!this.menuAbierto) this.seccionAbierta = null;
  }

  cerrarMenu() {
    this.menuAbierto = false;
    this.seccionAbierta = null;
  }

  toggleSeccion(id: string) {
    this.seccionAbierta = this.seccionAbierta === id ? null : id;
  }

  // Escape cierra el menú y devuelve el foco al botón hamburguesa
  @HostListener('document:keydown.escape')
  alPresionarEscape() {
    if (!this.menuAbierto && !this.seccionAbierta) return;
    this.cerrarMenu();
    this.botonMenu?.nativeElement.focus();
  }

  // Clic fuera del header cierra todo; clic fuera de un grupo cierra el desplegable abierto
  @HostListener('document:click', ['$event'])
  alHacerClic(evento: MouseEvent) {
    const destino = evento.target as HTMLElement;
    if (!this.host.nativeElement.contains(destino)) {
      this.cerrarMenu();
      return;
    }
    if (this.seccionAbierta && !destino.closest('.grupo')) {
      this.seccionAbierta = null;
    }
  }
}
