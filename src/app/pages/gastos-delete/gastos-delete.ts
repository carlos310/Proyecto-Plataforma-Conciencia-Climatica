import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Gastos } from '../../components/gastos-form/gastos-form';
import type { Gasto } from '../../../../src/domain/gastos.js';
import { eliminarRegistro, fechaISO, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-gastos-delete',
  imports: [FormsModule, Gastos],
  templateUrl: './gastos-delete.html',
  styleUrl: './gastos-delete.css',
})
export class GastosDelete {
  id: number | null = null;
  fecha = '';
  registro: Gasto | null = null;
  mensaje = '';

  async buscar() {
    try {
      this.registro = this.id
        ? await obtenerPorId<Gasto>('gastos/gastos', this.id)
        : ((await obtenerTodos<Gasto>('gastos/gastos')).find(g => fechaISO(g.date) === this.fecha) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ningún gasto con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el gasto';
    }
  }

  // DELETE /api/gastos/gastos/:id
  async borrar() {
    const id = this.registro?.id;
    if (!id || !confirm('¿Seguro que deseas borrar este gasto?')) return;
    try {
      await eliminarRegistro('gastos/gastos', id);
      this.registro = null;
      this.mensaje = 'Gasto borrado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error borrando el gasto';
    }
  }
}
