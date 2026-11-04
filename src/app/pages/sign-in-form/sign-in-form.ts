import { Component } from '@angular/core';
import { UsersMainForm } from '../../components/users-main-form/users-main-form';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-sign-in-form',
  standalone:true,
  imports: [UsersMainForm],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css',
})
export class SignInForm {
  mensaje = '';

  // POST /api/usuarios/users (registro público, sin token)
  async crear(valores: { nombre: string; email: string; contrasena: string; rol: string }) {
    try {
      // El rol no se envía: el servidor asigna cliente a todo registro público
      await crearRegistro('usuarios/users', {
        name: valores.nombre,
        email: valores.email,
        password: valores.contrasena,
      });
      this.mensaje = 'Usuario creado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error creando el usuario';
    }
  }
}
