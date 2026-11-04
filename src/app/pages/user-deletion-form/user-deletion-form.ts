import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersMainForm } from '../../components/users-main-form/users-main-form';
import type { User } from '../../../../src/domain/user.js';
import { eliminarRegistro, obtenerPorId } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-user-deletion-form',
  standalone:true,
  imports: [FormsModule, UsersMainForm],
  templateUrl: './user-deletion-form.html',
  styleUrl: './user-deletion-form.css',
})
export class UserDeletionForm {
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

  // DELETE /api/usuarios/users/:id
  async borrar() {
    const id = this.registro?.id;
    if (!id || !confirm('¿Seguro que deseas borrar este usuario?')) return;
    try {
      await eliminarRegistro('usuarios/users', id, this.authHeaders());
      this.registro = null;
      this.mensaje = 'Usuario borrado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error borrando el usuario';
    }
  }
}
