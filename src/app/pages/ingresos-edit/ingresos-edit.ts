import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IngresosMainForm, IngresosFormValores } from '../../components/ingresos-main-form/ingresos-main-form';
import type { Ingreso } from '../../../../src/domain/ingresos.js';
import { actualizarRegistro, fechaISO, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-ingresos-edit',
  imports: [FormsModule, IngresosMainForm],
  templateUrl: './ingresos-edit.html',
  styleUrl: './ingresos-edit.css',
})
export class IngresosEdit {
  id: number | null = null;
  fecha = '';
  registro: Ingreso | null = null;
  mensaje = '';

  async buscar() {
    try {
      // Por ID si se escribió; si no, por fecha (primer ingreso que coincida)
      this.registro = this.id
        ? await obtenerPorId<Ingreso>('ingresos/ingresos', this.id)
        : ((await obtenerTodos<Ingreso>('ingresos/ingresos')).find(i => fechaISO(i.date) === this.fecha) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ningún ingreso con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el ingreso';
    }
  }

  // PUT /api/ingresos/Ingreso/:id con los nombres del dominio que espera el backend
  async guardar(valores: IngresosFormValores) {
    if (!this.registro) return;
    try {
      await actualizarRegistro('ingresos/Ingreso', this.registro.id, {
        description: valores.descripcion,
        value: valores.monto,
        date: valores.fecha,
        source: valores.fuente,
        usuId: valores.idUsuario,
      });
      this.registro = await obtenerPorId<Ingreso>('ingresos/ingresos', this.registro.id);
      this.mensaje = 'Ingreso actualizado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error actualizando el ingreso';
    }
  }
}
