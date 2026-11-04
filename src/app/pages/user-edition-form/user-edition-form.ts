import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersMainForm } from '../../components/users-main-form/users-main-form';
import { RouterModule } from '@angular/router';
import type { User } from '../../../../src/domain/user.js';
import { actualizarRegistro, obtenerPorId } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-user-edition-form',
  standalone:true,
  imports: [RouterModule, FormsModule, UsersMainForm],
  templateUrl: './user-edition-form.html',
  styleUrl: './user-edition-form.css',
})
export class UserEditionForm {
  id: number | null = null;
  registro: User | null = null;
  mensaje = '';

  // Las rutas de usuarios requieren el token de la sesión
  private authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Ingrese el ID del usuario';
      return;
    }
    try {
      this.registro = await obtenerPorId<User>('usuarios/users', this.id, this.authHeaders());
      this.mensaje = this.registro ? '' : 'No se encontró ningún usuario con ese ID';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el usuario';
    }
  }

  // PUT /api/usuarios/user/:id. La contraseña solo se envía si el usuario escribió una nueva
  async guardar(valores: { nombre: string; email: string; contrasena: string; rol: string }) {
    const id = this.registro?.id;
    if (!id) return;
    const datos: { name: string; email: string; rol: string; password?: string } = {
      name: valores.nombre,
      email: valores.email,
      rol: valores.rol,
    };
    if (valores.contrasena) {
      datos.password = valores.contrasena;
    }
    try {
      await actualizarRegistro('usuarios/user', id, datos, this.authHeaders());
      this.registro = await obtenerPorId<User>('usuarios/users', id, this.authHeaders());
      this.mensaje = 'Usuario actualizado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error actualizando el usuario';
    }
  }
}
