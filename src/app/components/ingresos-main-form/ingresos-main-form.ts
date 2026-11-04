import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Ingreso } from '../../../../src/domain/ingresos.js';
import { fechaISO } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

export interface IngresosFormValores {
  descripcion: string;
  monto: number | null;
  fecha: string;
  fuente: string;
  idUsuario: number | null;
}

@Component({
  selector: 'app-ingresos-main-form',
  imports: [FormsModule],
  templateUrl: './ingresos-main-form.html',
  styleUrl: './ingresos-main-form.css',
})
export class IngresosMainForm {
  @Output() guardar = new EventEmitter<IngresosFormValores>();
  @Input() soloLectura = false;

  model: IngresosFormValores = { descripcion: '', monto: null, fecha: '', fuente: '', idUsuario: null };

  @Input() set registro(ingreso: Ingreso | null) {
    if (!ingreso) return;
    this.model = {
      descripcion: ingreso.description,
      monto: ingreso.value,
      fecha: fechaISO(ingreso.date),
      fuente: ingreso.source,
      idUsuario: ingreso.usuId,
    };
  }

  emitirGuardar() {
    this.guardar.emit({ ...this.model });
  }
}
