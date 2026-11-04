import { Component } from '@angular/core';
import { IngresosMainForm, IngresosFormValores } from '../../components/ingresos-main-form/ingresos-main-form';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-ingresos-create',
  imports: [IngresosMainForm],
  templateUrl: './ingresos-create.html',
  styleUrl: './ingresos-create.css',
})
export class IngresosCreate {
  mensaje = '';

  // POST /api/ingresos/ingresos
  async crear(valores: IngresosFormValores) {
    try {
      await crearRegistro('ingresos/ingresos', {
        description: valores.descripcion,
        value: valores.monto,
        date: valores.fecha,
        source: valores.fuente,
        usuId: valores.idUsuario,
      });
      this.mensaje = 'Ingreso creado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error creando el ingreso';
    }
  }
}
