import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users-main-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users-main-form.html',
  styleUrl: './users-main-form.css',
})
export class UsersMainForm {
  constructor(private router: Router) {}
  // En registro el rol lo asigna el servidor (cliente); en borrado no se muestra. En edición lo cambia el admin
  private rolHiddenRoutes: string[] = ['/user-deletion-form', '/signIn'];
  get rolHidden(): boolean {
    return this.rolHiddenRoutes.includes(this.router.url);
  }
  private signingHidden: string[] = ['/login'];
  get hiddenSignInFields(): boolean {
    return this.signingHidden.includes(this.router.url);
  }
  // Empleado ya incluye los permisos de Cliente (cliente < empleado < admin), por eso "Empleado y Cliente" es el rol empleado
  readonly opcionesRol = [
    { valor: 'admin', etiqueta: 'Admin' },
    { valor: 'empleado', etiqueta: 'Empleado' },
    { valor: 'cliente', etiqueta: 'Cliente' },
  ];

  nombre: string = '';
  email: string = '';
  contrasena: string = '';
  rol: string = '';

  // Al buscar un usuario se llenan nombre, email y rol; la contraseña no se precarga
  @Input() set registro(usuario: { name: string; email: string; rol: string } | null) {
    if (!usuario) return;
    this.nombre = usuario.name;
    this.email = usuario.email;
    this.rol = usuario.rol.trim().toLowerCase();
    this.contrasena = '';
  }

  @Output() datosListos = new EventEmitter<{ email: string; contrasena: string }>();
  @Output() guardar = new EventEmitter<{ nombre: string; email: string; contrasena: string; rol: string }>();
  @Input() soloLectura = false;

  emitirGuardar() {
    this.guardar.emit({ nombre: this.nombre, email: this.email, contrasena: this.contrasena, rol: this.rol });
  }

  emitirDatos() {
    const datos = { email: this.email, contrasena: this.contrasena };
    this.datosListos.emit(datos);
    console.log("Datos emitidos desde UsersMainForm:", datos);
  }
  
}
