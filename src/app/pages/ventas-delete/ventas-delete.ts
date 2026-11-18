import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { obtenerPorId, obtenerTodos, eliminarRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-ventas-delete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ventas-delete.html',
  styleUrl: './ventas-delete.css',
})
export class VentasDeleteComponent {
  id: number | null = null;
  mensaje = '';
  registro: any = null;

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Por favor ingresa un ID';
      return;
    }
    try {
      this.registro = await obtenerPorId('ventas', this.id);
      if (!this.registro) {
        this.mensaje = 'Venta no encontrada';
      }
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error buscando';
    }
  }

  async borrar() {
    if (!this.registro) {
      this.mensaje = 'Debes buscar una venta primero';
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      return;
    }
    try {
      await eliminarRegistro('ventas', this.registro.id);
      this.mensaje = 'Venta eliminada con éxito';
      this.registro = null;
      this.id = null;
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error eliminando';
    }
  }
}
