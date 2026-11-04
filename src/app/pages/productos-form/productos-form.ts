import { Component } from '@angular/core';
import { ProductosMainForm, ProductosFormValores } from '../../components/productos-main-form/productos-main-form';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-productos-form',
  imports: [ProductosMainForm],
  templateUrl: './productos-form.html',
  styleUrl: './productos-form.css',
})
export class ProductosForm {
  mensaje = '';

  // POST /api/productos/productos
  async crear(valores: ProductosFormValores) {
    try {
      await crearRegistro('productos/productos', {
        name: valores.nombre,
        description: valores.descripcion,
        sellValue: valores.precioVenta,
        buyValue: valores.precioCompra,
        stock: valores.stock,
        category: valores.categoria,
        providerId: valores.providerId,
      });
      this.mensaje = 'Producto creado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error creando el producto';
    }
  }
}
