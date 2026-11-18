import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

interface ClienteFormValores {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  rol: string;
}

@Component({
  selector: 'app-clientes-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes-create.html',
  styleUrl: './clientes-create.css',
})
export class ClientesCreate {
  mensaje = '';
  form: ClienteFormValores = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: 'cliente',
  };

  async crear() {
    if (!this.validar()) return;
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token!.split('.')[1]));
      await crearRegistro('clientes', {
        nombre: this.form.nombre,
        apellido: this.form.apellido,
        email: this.form.email,
        telefono: this.form.telefono,
        direccion: this.form.direccion,
        rol: this.form.rol,
        usuId: payload.id
      });
      this.mensaje = 'Cliente creado con éxito';
      this.limpiarForm();
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error creando el cliente';
    }
  }

  validar(): boolean {
    if (!this.form.nombre || !this.form.apellido || !this.form.email || !this.form.telefono || !this.form.direccion) {
      this.mensaje = 'Por favor rellena todos los campos requeridos';
      return false;
    }
    return true;
  }

  limpiarForm() {
    this.form = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      rol: 'cliente',
    };
  }
}
