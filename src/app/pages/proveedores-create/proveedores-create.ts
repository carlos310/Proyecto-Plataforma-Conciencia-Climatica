import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-proveedores-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './proveedores-create.html',
  styleUrl: './proveedores-create.css',
})
export class ProveedoresCreateComponent {
  mensaje = '';
  formData = { nombre: '', email: '', telefono: '', direccion: '', ciudad: '', pais: '', contacto: '', estado: 'activo' };

  async crear() {
    try {
      await crearRegistro('proveedores', {
        nombre: this.formData.nombre,
        email: this.formData.email,
        telefono: this.formData.telefono,
        direccion: this.formData.direccion,
        ciudad: this.formData.ciudad,
        pais: this.formData.pais,
        contacto: this.formData.contacto,
        estado: this.formData.estado.toLowerCase()
      });
      this.mensaje = 'Proveedor creado con éxito';
      this.resetForm();
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error';
    }
  }

  resetForm() {
    this.formData = { nombre: '', email: '', telefono: '', direccion: '', ciudad: '', pais: '', contacto: '', estado: 'activo' };
  }
}
