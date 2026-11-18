import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { actualizarRegistro, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

interface Cliente {
  id: number;
  cli_nombre: string;
  cli_apellido: string;
  cli_email: string;
  cli_telefono: string;
  cli_direccion: string;
  cli_rol: string;
}

interface ClienteFormValores {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  rol: string;
}

@Component({
  selector: 'app-clientes-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes-edit.html',
  styleUrl: './clientes-edit.css',
})
export class ClientesEdit {
  idBusqueda: number | null = null;
  nombreBusqueda = '';
  registro: Cliente | null = null;
  mensaje = '';
  form: ClienteFormValores = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: 'cliente',
  };

  async buscar() {
    try {
      let cliente: Cliente | null | undefined = null;
      if (this.idBusqueda) {
        cliente = await obtenerPorId<Cliente>('clientes', this.idBusqueda);
      } else if (this.nombreBusqueda) {
        const todos = await obtenerTodos<Cliente>('clientes');
        cliente = todos.find(c => c.cli_nombre.toLowerCase().includes(this.nombreBusqueda.toLowerCase()));
      }

      if (cliente) {
        this.registro = cliente;
        this.form = {
          nombre: cliente.cli_nombre,
          apellido: cliente.cli_apellido,
          email: cliente.cli_email,
          telefono: cliente.cli_telefono,
          direccion: cliente.cli_direccion,
          rol: cliente.cli_rol,
        };
        this.mensaje = '';
      } else {
        this.registro = null;
        this.mensaje = 'No se encontró ningún cliente con esos datos';
      }
    } catch (error) {
      this.registro = null;
      this.mensaje = 'Error consultando el cliente';
    }
  }

  async guardar() {
    if (!this.registro) return;
    try {
      await actualizarRegistro('clientes', this.registro.id, {
        nombre: this.form.nombre,
        apellido: this.form.apellido,
        email: this.form.email,
        telefono: this.form.telefono,
        direccion: this.form.direccion,
        rol: this.form.rol,
      });
      this.registro = await obtenerPorId<Cliente>('clientes', this.registro.id);
      this.mensaje = 'Cliente actualizado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error actualizando el cliente';
    }
  }
}
