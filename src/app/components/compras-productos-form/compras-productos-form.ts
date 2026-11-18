import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Compra } from '../../../../src/domain/compras.js';
import type { Proveedor } from '../../../../src/domain/proveedor.js';
import { fechaISO, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';
import { leerSesion } from '../../../../src/infrastructure/adapter/authService.js';

export interface ComprasFormValores {
  total: number | null;
  cantidad: number | null;
  fecha: string;
  proveedor: number | null;
  idUsuario: number | null;
}

@Component({
  selector: 'app-compras-productos-form',
  imports: [FormsModule],
  templateUrl: './compras-productos-form.html',
  styleUrl: './compras-productos-form.css',
})
export class ComprasProductosForm implements OnInit {
  @Output() guardar = new EventEmitter<ComprasFormValores>();
  @Input() soloLectura = false;

  model: ComprasFormValores = { total: null, cantidad: null, fecha: '', proveedor: null, idUsuario: null };

  // Proveedores existentes para elegir de una lista (evita enviar un ID que no existe en la base).
  // Si no se pueden cargar (p. ej. el rol no tiene permiso de consulta), el formulario vuelve al campo numérico.
  proveedores: Proveedor[] = [];

  @Input() set registro(compra: Compra | null) {
    if (!compra) return;
    this.model = {
      total: compra.total,
      cantidad: compra.quantity,
      fecha: fechaISO(compra.date),
      proveedor: compra.providerId,
      idUsuario: compra.usuId,
    };
  }

  async ngOnInit() {
    // En el render del servidor no hay sesión; la carga se hace en el navegador
    if (typeof localStorage === 'undefined') return;

    // El usuario que registra la compra es el de la sesión, salvo que el registro ya traiga uno
    this.model.idUsuario ??= leerSesion()?.id ?? null;

    try {
      this.proveedores = await obtenerTodos<Proveedor>('proveedores');
    } catch {
      this.proveedores = [];
    }
  }

  emitirGuardar() {
    this.guardar.emit({ ...this.model });
  }
}
