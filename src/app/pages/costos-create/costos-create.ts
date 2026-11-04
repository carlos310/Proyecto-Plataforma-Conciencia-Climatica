import { Component } from '@angular/core';
import { Costos, CostosFormValores } from '../../components/costos-form/costos-form';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-costos-create',
  imports: [Costos],
  templateUrl: './costos-create.html',
  styleUrl: './costos-create.css',
})
export class CostosCreate {
  mensaje = '';

  // POST /api/costos/costos
  async crear(valores: CostosFormValores) {
    try {
      await crearRegistro('costos/costos', {
        description: valores.descripcion,
        value: valores.monto,
        date: valores.fecha,
        source: valores.fuente,
        empId: valores.empId,
        usuId: valores.idUsuario,
      });
      this.mensaje = 'Costo creado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error creando el costo';
    }
  }
}
