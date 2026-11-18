import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { crearRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

interface EmpleadoFormValores {
  nombre: string;
  apellido: string;
  cargo: string;
  salario: number;
  fecha_contratacion: string;
  rol: string;
}

@Component({
  selector: 'app-empleados-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empleados-create.html',
  styleUrl: './empleados-create.css',
})
export class EmpleadosCreate {
  mensaje = '';
  form: EmpleadoFormValores = {
    nombre: '',
    apellido: '',
    cargo: '',
    salario: 0,
    fecha_contratacion: '',
    rol: 'empleado',
  };

  async crear() {
    if (!this.validar()) return;
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token!.split('.')[1]));
      await crearRegistro('empleados', {
        nombre: this.form.nombre,
        apellido: this.form.apellido,
        cargo: this.form.cargo,
        salario: this.form.salario,
        fechaContratacion: this.form.fecha_contratacion,
        rol: this.form.rol,
        usuId: payload.id
      });
      this.mensaje = 'Empleado creado con éxito';
      this.limpiarForm();
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error creando el empleado';
    }
  }

  validar(): boolean {
    if (!this.form.nombre || !this.form.apellido || !this.form.cargo || !this.form.salario || !this.form.fecha_contratacion) {
      this.mensaje = 'Por favor rellena todos los campos requeridos';
      return false;
    }
    return true;
  }

  limpiarForm() {
    this.form = {
      nombre: '',
      apellido: '',
      cargo: '',
      salario: 0,
      fecha_contratacion: '',
      rol: 'empleado',
    };
  }
}
