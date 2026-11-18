import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { obtenerPorId, obtenerTodos, actualizarRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-facturas-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './facturas-edit.html',
  styleUrl: './facturas-edit.css',
})
export class FacturasEditComponent {
  id: number | null = null;
  mensaje = '';
  registro: any = null;
  formData: any = {
    tipo: 'compra',
    referenciaId: '',
    fecha: '',
    total: '',
    cantidad: '',
    estado: 'pendiente',
    proveedorCliente: '',
    loteId: ''
  };

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Por favor ingresa un ID';
      return;
    }
    try {
      this.registro = await obtenerPorId('facturas', this.id);
      if (this.registro) {
        this.formData = {
          tipo: this.registro.tipo,
          referenciaId: this.registro.referenciaId,
          fecha: this.registro.fecha,
          total: this.registro.total,
          cantidad: this.registro.cantidad,
          estado: this.registro.estado,
          proveedorCliente: this.registro.proveedorCliente,
          loteId: this.registro.loteId
        };
      } else {
        this.mensaje = 'Factura no encontrada';
      }
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error buscando';
    }
  }

  async guardar() {
    if (!this.registro) {
      this.mensaje = 'Debes buscar una factura primero';
      return;
    }
    try {
      await actualizarRegistro('facturas', this.registro.id, {
        tipo: this.formData.tipo.toLowerCase(),
        referenciaId: parseInt(this.formData.referenciaId),
        fecha: this.formData.fecha,
        total: parseFloat(this.formData.total),
        cantidad: parseInt(this.formData.cantidad),
        estado: this.formData.estado.toLowerCase(),
        proveedorCliente: this.formData.proveedorCliente,
        // El input es type="number" pero el backend guarda el lote como texto
        loteId: this.formData.loteId ? String(this.formData.loteId) : undefined
      });
      this.mensaje = 'Factura actualizada con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error guardando';
    }
  }
}
