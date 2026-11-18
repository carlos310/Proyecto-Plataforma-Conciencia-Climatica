import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { eliminarRegistro, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

interface Cliente {
  id: number;
  cli_nombre: string;
  cli_apellido: string;
  cli_email: string;
  cli_telefono: string;
  cli_direccion: string;
  cli_rol: string;
}

@Component({
  selector: 'app-clientes-delete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes-delete.html',
  styleUrl: './clientes-delete.css',
})
export class ClientesDelete {
  idBusqueda: number | null = null;
  nombreBusqueda = '';
  registro: Cliente | null = null;
  mensaje = '';

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

  async borrar() {
    const id = this.registro?.id;
    if (!id || !confirm('¿Seguro que deseas borrar este cliente?')) return;
    try {
      await eliminarRegistro('clientes', id);
      this.registro = null;
      this.mensaje = 'Cliente borrado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error borrando el cliente';
    }
  }
}
