import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComprasProductosForm } from '../../components/compras-productos-form/compras-productos-form';
import type { Compra } from '../../../../src/domain/compras.js';
import { eliminarRegistro, fechaISO, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';


@Component({
  selector: 'app-compras-productos-delete',
  imports: [FormsModule, ComprasProductosForm],
  templateUrl: './compras-productos-delete.html',
  styleUrl: './compras-productos-delete.css',
})
export class ComprasProductosDelete {
  id: number | null = null;
  fecha = '';
  registro: Compra | null = null;
  mensaje = '';

  async buscar() {
    try {
      this.registro = this.id
        ? await obtenerPorId<Compra>('compras/compras', this.id)
        : ((await obtenerTodos<Compra>('compras/compras')).find(c => fechaISO(c.date) === this.fecha) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ninguna compra con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando la compra';
    }
  }

  // DELETE /api/compras/compras/:id
  async borrar() {
    const id = this.registro?.id;
    if (!id || !confirm('¿Seguro que deseas borrar esta compra?')) return;
    try {
      await eliminarRegistro('compras/compras', id);
      this.registro = null;
      this.mensaje = 'Compra borrada con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error borrando la compra';
    }
  }
}
