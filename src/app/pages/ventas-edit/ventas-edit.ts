import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { obtenerPorId, obtenerTodos, actualizarRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-ventas-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ventas-edit.html',
  styleUrl: './ventas-edit.css',
})
export class VentasEditComponent {
  id: number | null = null;
  mensaje = '';
  registro: any = null;
  formData: any = {
    total: '',
    cantidad: '',
    fecha: '',
    clienteId: ''
  };

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Por favor ingresa un ID';
      return;
    }
    try {
      this.registro = await obtenerPorId('ventas', this.id);
      if (this.registro) {
        this.formData = {
          total: this.registro.total,
          cantidad: this.registro.cantidad,
          fecha: this.registro.fecha,
          clienteId: this.registro.clienteId
        };
      } else {
        this.mensaje = 'Venta no encontrada';
      }
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error buscando';
    }
  }

  async guardar() {
    if (!this.registro) {
      this.mensaje = 'Debes buscar una venta primero';
      return;
    }
    try {
      await actualizarRegistro('ventas', this.registro.id, {
        total: parseFloat(this.formData.total),
        cantidad: parseInt(this.formData.cantidad),
        fecha: this.formData.fecha,
        clienteId: parseInt(this.formData.clienteId)
      });
      this.mensaje = 'Venta actualizada con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error guardando';
    }
  }
}
