import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { obtenerPorId, obtenerTodos, actualizarRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-empleados-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empleados-edit.html',
  styleUrl: './empleados-edit.css',
})
export class EmpleadosEditComponent {
  id: number | null = null;
  mensaje = '';
  registro: any = null;
  formData: any = {
    nombre: '',
    apellido: '',
    cargo: '',
    salario: '',
    fechaContratacion: '',
    rol: 'empleado'
  };

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Por favor ingresa un ID';
      return;
    }
    try {
      this.registro = await obtenerPorId('empleados', this.id);
      if (this.registro) {
        this.formData = {
          nombre: this.registro.nombre,
          apellido: this.registro.apellido,
          cargo: this.registro.cargo,
          salario: this.registro.salario,
          fechaContratacion: this.registro.fechaContratacion,
          rol: this.registro.rol
        };
      } else {
        this.mensaje = 'Empleado no encontrado';
      }
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error buscando';
    }
  }

  async guardar() {
    if (!this.registro) {
      this.mensaje = 'Debes buscar un empleado primero';
      return;
    }
    try {
      await actualizarRegistro('empleados', this.registro.id, {
        nombre: this.formData.nombre,
        apellido: this.formData.apellido,
        cargo: this.formData.cargo,
        salario: this.formData.salario,
        fechaContratacion: this.formData.fechaContratacion,
        rol: this.formData.rol
      });
      this.mensaje = 'Empleado actualizado con éxito';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error guardando';
    }
  }
}
