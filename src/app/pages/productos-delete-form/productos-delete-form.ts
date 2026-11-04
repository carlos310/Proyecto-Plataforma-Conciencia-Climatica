import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosMainForm } from '../../components/productos-main-form/productos-main-form';
import type { Producto } from '../../../../src/domain/producto.js';
import { eliminarRegistro, obtenerPorId, obtenerTodos } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-productos-delete-form',
  imports: [FormsModule, ProductosMainForm],
  templateUrl: './productos-delete-form.html',
  styleUrl: './productos-delete-form.css',
})
export class ProductosDeleteForm {
  id: number | null = null;
  nombre = '';
  registro: Producto | null = null;
  mensaje = '';

  async buscar() {
    try {
      this.registro = this.id
        ? await obtenerPorId<Producto>('productos/productos', this.id)
        : ((await obtenerTodos<Producto>('productos/productos')).find(p => p.name.toLowerCase() === this.nombre.trim().toLowerCase()) ?? null);
      this.mensaje = this.registro ? '' : 'No se encontró ningún producto con esos datos';
    } catch {
      this.registro = null;
      this.mensaje = 'Error consultando el producto';
    }
  }

  // DELETE /api/productos/productos/:id
  async borrar() {
    const id = this.registro?.id;
    if (!id || !confirm('¿Seguro que deseas borrar este producto?')) return;
    try {
      await eliminarRegistro('productos/productos', id);
      this.registro = null;
      this.mensaje = 'Producto borrado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error borrando el producto';
    }
  }
}
