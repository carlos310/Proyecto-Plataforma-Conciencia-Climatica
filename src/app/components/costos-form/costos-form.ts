import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Costo } from '../../../../src/domain/costos.js';
import { fechaISO } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

export interface CostosFormValores {
  descripcion: string;
  monto: number | null;
  fecha: string;
  fuente: string;
  empId: number | null;
  idUsuario: number | null;
}

@Component({
  selector: 'app-costos-form',
  imports: [FormsModule],
  templateUrl: './costos-form.html',
  styleUrl: './costos-form.css',
})
export class Costos {
  @Output() guardar = new EventEmitter<CostosFormValores>();
  @Input() soloLectura = false;

  model: CostosFormValores = { descripcion: '', monto: null, fecha: '', fuente: '', empId: null, idUsuario: null };

  @Input() set registro(costo: Costo | null) {
    if (!costo) return;
    this.model = {
      descripcion: costo.description,
      monto: costo.value,
      fecha: fechaISO(costo.date),
      fuente: costo.source,
      empId: costo.empId,
      idUsuario: costo.usuId,
    };
  }

  emitirGuardar() {
    this.guardar.emit({ ...this.model });
  }
}
