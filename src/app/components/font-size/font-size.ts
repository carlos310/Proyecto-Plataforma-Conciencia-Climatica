import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { hasSession, logout } from '../../../../src/infrastructure/adapter/authService.js';
@Component({
  selector: 'app-font-size',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './font-size.html',
  styleUrl: './font-size.css',
})
export class FontSize {
  constructor(private router: Router) {} 
  escucharBotones(){
    const escuchar=document.querySelectorAll('button');
    escuchar.forEach(btn=>{
      btn.addEventListener('click',()=>{
        this.cambiarFuente(btn.id);
      });
    });

  }
  cambiarFuente(id:string) {
    // Obtenemos el tamaño actual//
    let fontSizeActual = window.getComputedStyle(document.body).fontSize;
    
    // Convertimos a número quitando el "px"//
    let numeroActual = parseFloat(fontSizeActual);
    console.log(numeroActual);

    if (id === 'aumentar'&& numeroActual<20) {
        document.body.style.fontSize = (numeroActual + 1) + "px";
    } else if (id === 'disminuir') {
        // Ponemos un límite mínimo para que no desaparezca la letra
        if (numeroActual > 10) {
            document.body.style.fontSize = (numeroActual - 1) + "px";
        }
      }
  }
  cambiarAproductosDas() {
    this.router.navigate(['/productosDashboard']);
  }

  get isLoggedIn(): boolean {
    return hasSession();
  }

  cerrarSesion() {
    logout();
    this.router.navigate(['/']);
  }

}
