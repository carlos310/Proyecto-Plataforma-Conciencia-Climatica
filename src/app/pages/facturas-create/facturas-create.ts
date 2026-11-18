import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-facturas-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './facturas-create.html',
  styleUrl: './facturas-create.css',
})
export class FacturasCreateComponent {
  mensaje = '';
  formData = {
    tipo: 'compra',
    referenciaId: '',
    fecha: '',
    total: '',
    cantidad: '',
    estado: 'pendiente',
    proveedorCliente: '',
    loteId: ''
  };

  async crear() {
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token!.split('.')[1]));
      await crearRegistro('facturas', {
        tipo: this.formData.tipo.toLowerCase(),
        referenciaId: Number.parseInt(this.formData.referenciaId),
        fecha: this.formData.fecha,
        total: Number.parseFloat(this.formData.total),
        cantidad: Number.parseInt(this.formData.cantidad),
        estado: this.formData.estado.toLowerCase(),
        proveedorCliente: this.formData.proveedorCliente,
        // El input es type="number" pero el backend guarda el lote como texto
        loteId: this.formData.loteId ? String(this.formData.loteId) : undefined,
        usuId: payload.id
      });
      this.mensaje = 'Factura creada con éxito';
      this.resetForm();
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error';
    }
  }

  resetForm() {
    this.formData = {
      tipo: 'compra',
      referenciaId: '',
      fecha: '',
      total: '',
      cantidad: '',
      estado: 'pendiente',
      proveedorCliente: '',
      loteId: ''
    };
  }
}
