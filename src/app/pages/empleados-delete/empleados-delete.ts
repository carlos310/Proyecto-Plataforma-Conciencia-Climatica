import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { obtenerPorId, obtenerTodos, eliminarRegistro } from '../../../../src/infrastructure/adapter/consultasAdapter.js';

@Component({
  selector: 'app-empleados-delete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empleados-delete.html',
  styleUrl: './empleados-delete.css',
})
export class EmpleadosDeleteComponent {
  id: number | null = null;
  mensaje = '';
  registro: any = null;

  async buscar() {
    if (!this.id) {
      this.mensaje = 'Por favor ingresa un ID';
      return;
    }
    try {
      this.registro = await obtenerPorId('empleados', this.id);
      if (!this.registro) {
        this.mensaje = 'Empleado no encontrado';
      }
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error buscando';
    }
  }

  async borrar() {
    if (!this.registro) {
      this.mensaje = 'Debes buscar un empleado primero';
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      return;
    }
    try {
      await eliminarRegistro('empleados', this.registro.id);
      this.mensaje = 'Empleado eliminado con éxito';
      this.registro = null;
      this.id = null;
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'Error eliminando';
    }
  }
}
