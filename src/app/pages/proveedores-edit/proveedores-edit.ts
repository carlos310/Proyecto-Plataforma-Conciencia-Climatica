import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { obtenerPorId, obtenerTodos, actualizarRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-proveedores-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './proveedores-edit.html',
  styleUrl: './proveedores-edit.css',
})
export class ProveedoresEditComponent {
  id: number | null = null;
  mensaje = '';
  registro: any = null;
  formData: any = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    contacto: '',
    estado: 'activo'
  };

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Por favor ingresa un ID';
      return;
    }
    try {
      this.registro = await obtenerPorId('proveedores', this.id);
      if (this.registro) {
        this.formData = { ...this.registro };
      } else {
        this.mensaje = 'Proveedor no encontrado';
      }
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error buscando';
    }
  }

  async guardar() {
    if (!this.registro) {
      this.mensaje = 'Debes buscar un proveedor primero';
      return;
    }
    try {
      await actualizarRegistro('proveedores', this.registro.id, this.formData);
      this.mensaje = 'Proveedor actualizado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error guardando';
    }
  }
}
