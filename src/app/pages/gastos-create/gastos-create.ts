import { Component } from '@angular/core';
import { Gastos, GastosFormValores } from '../../components/gastos-form/gastos-form';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-gastos-create',
  imports: [Gastos],
  templateUrl: './gastos-create.html',
  styleUrl: './gastos-create.css',
})
export class GastosCreate {
  mensaje = '';

  // POST /api/gastos/gastos
  async crear(valores: GastosFormValores) {
    try {
      await crearRegistro('gastos/gastos', {
        description: valores.descripcion,
        value: valores.monto,
        date: valores.fecha,
        empId: valores.empId,
        usuId: valores.idUsuario,
      });
      this.mensaje = 'Gasto creado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error creando el gasto';
    }
  }
}
