import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Gastos, GastosFormValores } from '../../components/gastos-form/gastos-form';
import type { Gasto } from '../../../../src/domain/gastos.js';
import { actualizarRegistro, fechaISO, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-gastos-edit',
  imports: [FormsModule, Gastos],
  templateUrl: './gastos-edit.html',
  styleUrl: './gastos-edit.css',
})
export class GastosEdit {
  id: number | null = null;
  fecha = '';
  registro: Gasto | null = null;
  mensaje = '';

  async buscar() {
    try {
      // Por ID si se escribió; si no, por fecha (primer gasto que coincida)
      this.registro = this.id
        ? await obtenerPorId<Gasto>('gastos/gastos', this.id)
        : ((await obtenerTodos<Gasto>('gastos/gastos')).find(g => fechaISO(g.date) === this.fecha) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ningún gasto con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el gasto';
    }
  }

  // PUT /api/gastos/Gasto/:id con los nombres del dominio que espera el backend
  async guardar(valores: GastosFormValores) {
    if (!this.registro) return;
    try {
      await actualizarRegistro('gastos/Gasto', this.registro.id, {
        description: valores.descripcion,
        value: valores.monto,
        date: valores.fecha,
        empId: valores.empId,
        usuId: valores.idUsuario,
      });
      this.registro = await obtenerPorId<Gasto>('gastos/gastos', this.registro.id);
      this.mensaje = 'Gasto actualizado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error actualizando el gasto';
    }
  }
}
