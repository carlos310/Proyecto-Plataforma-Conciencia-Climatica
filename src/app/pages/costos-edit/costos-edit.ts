import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Costos, CostosFormValores } from '../../components/costos-form/costos-form';
import type { Costo } from '../../../../src/domain/costos.js';
import { actualizarRegistro, fechaISO, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';


@Component({
  selector: 'app-costos-edit',
  imports: [FormsModule, Costos],
  templateUrl: './costos-edit.html',
  styleUrl: './costos-edit.css',
})
export class CostosEdit {
  id: number | null = null;
  fecha = '';
  registro: Costo | null = null;
  mensaje = '';

  async buscar() {
    try {
      // Por ID si se escribió; si no, por fecha (primer costo que coincida)
      this.registro = this.id
        ? await obtenerPorId<Costo>('costos/costos', this.id)
        : ((await obtenerTodos<Costo>('costos/costos')).find(c => fechaISO(c.date) === this.fecha) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ningún costo con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el costo';
    }
  }

  // PUT /api/costos/Costo/:id con los nombres del dominio que espera el backend
  async guardar(valores: CostosFormValores) {
    if (!this.registro) return;
    try {
      await actualizarRegistro('costos/Costo', this.registro.id, {
        description: valores.descripcion,
        value: valores.monto,
        date: valores.fecha,
        source: valores.fuente,
        empId: valores.empId,
        usuId: valores.idUsuario,
      });
      this.registro = await obtenerPorId<Costo>('costos/costos', this.registro.id);
      this.mensaje = 'Costo actualizado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error actualizando el costo';
    }
  }
}
