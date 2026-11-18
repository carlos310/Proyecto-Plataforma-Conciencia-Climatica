import { Empleado } from './empleado.js';

export interface EmpleadoPort {
    createEmpleado(empleado: Omit<Empleado, 'id'>): Promise<number>;
    updateEmpleado(id: number, empleado: Partial<Empleado>): Promise<boolean>;
    deleteEmpleado(id: number): Promise<boolean>;
    getEmpleadoById(id: number): Promise<Empleado | null>;
    getEmpleadoAllEmpleado(): Promise<Empleado[]>;
}
