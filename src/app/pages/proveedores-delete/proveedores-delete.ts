import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { obtenerPorId, obtenerTodos, eliminarRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-proveedores-delete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './proveedores-delete.html',
  styleUrl: './proveedores-delete.css',
})
export class ProveedoresDeleteComponent {
  id: number | null = null;
  mensaje = '';
  registro: any = null;

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Por favor ingresa un ID';
      return;
    }
    try {
      this.registro = await obtenerPorId('proveedores', this.id);
      if (!this.registro) {
        this.mensaje = 'Proveedor no encontrado';
      }
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error buscando';
    }
  }

  async borrar() {
    if (!this.registro) {
      this.mensaje = 'Debes buscar un proveedor primero';
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      return;
    }
    try {
      await eliminarRegistro('proveedores', this.registro.id);
      this.mensaje = 'Proveedor eliminado con éxito';
      this.registro = null;
      this.id = null;
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error eliminando';
    }
  }
}
