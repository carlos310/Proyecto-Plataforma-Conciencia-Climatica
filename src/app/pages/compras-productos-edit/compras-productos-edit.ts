import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComprasProductosForm, ComprasFormValores } from '../../components/compras-productos-form/compras-productos-form';
import type { Compra } from '../../../../src/domain/compras.js';
import { actualizarRegistro, fechaISO, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';


@Component({
  selector: 'app-compras-productos-edit',
  imports: [FormsModule, ComprasProductosForm],
  templateUrl: './compras-productos-edit.html',
  styleUrl: './compras-productos-edit.css',
})
export class ComprasProductosEdit {
  id: number | null = null;
  fecha = '';
  registro: Compra | null = null;
  mensaje = '';

  async buscar() {
    try {
      // Por ID si se escribió; si no, por fecha (primera compra que coincida)
      this.registro = this.id
        ? await obtenerPorId<Compra>('compras/compras', this.id)
        : ((await obtenerTodos<Compra>('compras/compras')).find(c => fechaISO(c.date) === this.fecha) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ninguna compra con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando la compra';
    }
  }

  // PUT /api/compras/Compra/:id con los nombres del dominio que espera el backend
  async guardar(valores: ComprasFormValores) {
    if (!this.registro) return;
    try {
      await actualizarRegistro('compras/Compra', this.registro.id, {
        total: valores.total,
        quantity: valores.cantidad,
        date: valores.fecha,
        provider: valores.proveedor,
        usuId: valores.idUsuario,
      });
      this.registro = await obtenerPorId<Compra>('compras/compras', this.registro.id);
      this.mensaje = 'Compra actualizada con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error actualizando la compra';
    }
  }
}
