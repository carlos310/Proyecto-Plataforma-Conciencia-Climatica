import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Gasto } from '../../../../src/domain/gastos.js';
import { fechaISO } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

export interface GastosFormValores {
  descripcion: string;
  monto: number | null;
  fecha: string;
  empId: number | null;
  idUsuario: number | null;
}

@Component({
  selector: 'app-gastos-form',
  imports: [FormsModule],
  templateUrl: './gastos-form.html',
  styleUrl: './gastos-form.css',
})
export class Gastos {
  @Output() guardar = new EventEmitter<GastosFormValores>();
  @Input() soloLectura = false;

  model: GastosFormValores = { descripcion: '', monto: null, fecha: '', empId: null, idUsuario: null };

  @Input() set registro(gasto: Gasto | null) {
    if (!gasto) return;
    this.model = {
      descripcion: gasto.description,
      monto: gasto.value,
      fecha: fechaISO(gasto.date),
      empId: gasto.empId,
      idUsuario: gasto.usuId,
    };
  }

  emitirGuardar() {
    this.guardar.emit({ ...this.model });
  }
}
