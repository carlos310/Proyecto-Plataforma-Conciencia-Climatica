import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-ventas-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ventas-create.html',
  styleUrl: './ventas-create.css',
})
export class VentasCreateComponent {
  mensaje = '';
  formData = {
    total: '',
    cantidad: '',
    fecha: '',
    clienteId: ''
  };

  async crear() {
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token!.split('.')[1]));
      await crearRegistro('ventas', {
        total: parseFloat(this.formData.total),
        cantidad: parseInt(this.formData.cantidad),
        fecha: this.formData.fecha,
        clienteId: parseInt(this.formData.clienteId),
        usuId: payload.id
      });
      this.mensaje = 'Venta creada con éxito';
      this.resetForm();
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error';
    }
  }

  resetForm() {
    this.formData = {
      total: '',
      cantidad: '',
      fecha: '',
      clienteId: ''
    };
  }
}
