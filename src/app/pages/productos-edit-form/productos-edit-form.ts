import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosMainForm, ProductosFormValores } from '../../components/productos-main-form/productos-main-form';
import type { Producto } from '../../../../src/domain/producto.js';
import { actualizarRegistro, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-productos-edit-form',
  imports: [FormsModule, ProductosMainForm],
  templateUrl: './productos-edit-form.html',
  styleUrl: './productos-edit-form.css',
})
export class ProductosEditForm {
  id: number | null = null;
  nombre = '';
  registro: Producto | null = null;
  mensaje = '';

  async buscar() {
    try {
      // Por ID si se escribió; si no, por nombre (sin distinguir mayúsculas)
      this.registro = this.id
        ? await obtenerPorId<Producto>('productos/productos', this.id)
        : ((await obtenerTodos<Producto>('productos/productos')).find(p => p.name.toLowerCase() === this.nombre.trim().toLowerCase()) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ningún producto con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el producto';
    }
  }

  // PUT /api/productos/Producto/:id con los nombres del dominio que espera el backend
  async guardar(valores: ProductosFormValores) {
    if (!this.registro) return;
    try {
      await actualizarRegistro('productos/Producto', this.registro.id, {
        name: valores.nombre,
        description: valores.descripcion,
        sellValue: valores.precioVenta,
        buyValue: valores.precioCompra,
        stock: valores.stock,
        category: valores.categoria,
        providerId: valores.providerId,
      });
      this.registro = await obtenerPorId<Producto>('productos/productos', this.registro.id);
      this.mensaje = 'Producto actualizado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error actualizando el producto';
    }
  }
}
