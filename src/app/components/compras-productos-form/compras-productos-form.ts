import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Compra } from '../../../../src/domain/compras.js';
import { fechaISO } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

export interface ComprasFormValores {
  total: number | null;
  cantidad: number | null;
  fecha: string;
  proveedor: string;
  idUsuario: number | null;
}

@Component({
  selector: 'app-compras-productos-form',
  imports: [FormsModule],
  templateUrl: './compras-productos-form.html',
  styleUrl: './compras-productos-form.css',
})
export class ComprasProductosForm {
  @Output() guardar = new EventEmitter<ComprasFormValores>();
  @Input() soloLectura = false;

  model: ComprasFormValores = { total: null, cantidad: null, fecha: '', proveedor: '', idUsuario: null };

  @Input() set registro(compra: Compra | null) {
    if (!compra) return;
    this.model = {
      total: compra.total,
      cantidad: compra.quantity,
      fecha: fechaISO(compra.date),
      proveedor: compra.provider,
      idUsuario: compra.usuId,
    };
  }

  emitirGuardar() {
    this.guardar.emit({ ...this.model });
  }
}
