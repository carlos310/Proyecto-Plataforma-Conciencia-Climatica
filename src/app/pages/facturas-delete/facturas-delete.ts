import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { obtenerPorId, obtenerTodos, eliminarRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-facturas-delete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './facturas-delete.html',
  styleUrl: './facturas-delete.css',
})
export class FacturasDeleteComponent {
  id: number | null = null;
  mensaje = '';
  registro: any = null;

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Por favor ingresa un ID';
      return;
    }
    try {
      this.registro = await obtenerPorId('facturas', this.id);
      if (!this.registro) {
        this.mensaje = 'Factura no encontrada';
      }
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error buscando';
    }
  }

  async borrar() {
    if (!this.registro) {
      this.mensaje = 'Debes buscar una factura primero';
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      return;
    }
    try {
      await eliminarRegistro('facturas', this.registro.id);
      this.mensaje = 'Factura eliminada con éxito';
      this.registro = null;
      this.id = null;
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error eliminando';
    }
  }
}
