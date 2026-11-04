import { Component } from '@angular/core';
import { ComprasProductosForm, ComprasFormValores } from '../../components/compras-productos-form/compras-productos-form';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-compras-productos-create',
  imports: [ComprasProductosForm],
  templateUrl: './compras-productos-create.html',
  styleUrl: './compras-productos-create.css',
})
export class ComprasProductosCreate {
  mensaje = '';

  // POST /api/compras/compras
  async crear(valores: ComprasFormValores) {
    try {
      await crearRegistro('compras/compras', {
        total: valores.total,
        quantity: valores.cantidad,
        date: valores.fecha,
        provider: valores.proveedor,
        usuId: valores.idUsuario,
      });
      this.mensaje = 'Compra creada con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error creando la compra';
    }
  }
}
