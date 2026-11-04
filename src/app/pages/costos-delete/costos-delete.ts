import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Costos } from '../../components/costos-form/costos-form';
import type { Costo } from '../../../../src/domain/costos.js';
import { eliminarRegistro, fechaISO, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';


@Component({
  selector: 'app-costos-delete',
  imports: [FormsModule, Costos],
  templateUrl: './costos-delete.html',
  styleUrl: './costos-delete.css',
})
export class CostosDelete {
  id: number | null = null;
  fecha = '';
  registro: Costo | null = null;
  mensaje = '';

  async buscar() {
    try {
      this.registro = this.id
        ? await obtenerPorId<Costo>('costos/costos', this.id)
        : ((await obtenerTodos<Costo>('costos/costos')).find(c => fechaISO(c.date) === this.fecha) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ningún costo con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el costo';
    }
  }

  // DELETE /api/costos/costos/:id
  async borrar() {
    const id = this.registro?.id;
    if (!id || !confirm('¿Seguro que deseas borrar este costo?')) return;
    try {
      await eliminarRegistro('costos/costos', id);
      this.registro = null;
      this.mensaje = 'Costo borrado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error borrando el costo';
    }
  }
}
