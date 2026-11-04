import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Producto } from '../../../../src/domain/producto.js';

export interface ProductosFormValores {
  nombre: string;
  descripcion: string;
  precioVenta: number | null;
  precioCompra: number | null;
  stock: number | null;
  categoria: string;
  providerId: number | null;
}

@Component({
  selector: 'app-porductos-main-form',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './productos-main-form.html',
  styleUrl: './productos-main-form.css',
})
export class ProductosMainForm {
  @Output() guardar = new EventEmitter<ProductosFormValores>();
  @Input() soloLectura = false;

  model: ProductosFormValores = { nombre: '', descripcion: '', precioVenta: null, precioCompra: null, stock: null, categoria: '', providerId: null };

  @Input() set registro(producto: Producto | null) {
    if (!producto) return;
    this.model = {
      nombre: producto.name,
      descripcion: producto.description,
      precioVenta: producto.sellValue,
      precioCompra: producto.buyValue,
      stock: producto.stock,
      categoria: producto.category,
      providerId: producto.providerId,
    };
  }

  emitirGuardar() {
    this.guardar.emit({ ...this.model });
  }
};
