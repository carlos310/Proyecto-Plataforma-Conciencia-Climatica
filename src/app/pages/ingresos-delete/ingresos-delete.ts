import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IngresosMainForm } from '../../components/ingresos-main-form/ingresos-main-form';
import type { Ingreso } from '../../../../src/domain/ingresos.js';
import { eliminarRegistro, fechaISO, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';


@Component({
  selector: 'app-ingresos-delete',
  imports: [FormsModule, IngresosMainForm],
  templateUrl: './ingresos-delete.html',
  styleUrl: './ingresos-delete.css',
})
export class IngresosDelete {
  id: number | null = null;
  fecha = '';
  registro: Ingreso | null = null;
  mensaje = '';

  async buscar() {
    try {
      this.registro = this.id
        ? await obtenerPorId<Ingreso>('ingresos/ingresos', this.id)
        : ((await obtenerTodos<Ingreso>('ingresos/ingresos')).find(i => fechaISO(i.date) === this.fecha) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ningún ingreso con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el ingreso';
    }
  }

  // DELETE /api/ingresos/ingresos/:id
  async borrar() {
    const id = this.registro?.id;
    if (!id || !confirm('¿Seguro que deseas borrar este ingreso?')) return;
    try {
      await eliminarRegistro('ingresos/ingresos', id);
      this.registro = null;
      this.mensaje = 'Ingreso borrado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error borrando el ingreso';
    }
  }
}
