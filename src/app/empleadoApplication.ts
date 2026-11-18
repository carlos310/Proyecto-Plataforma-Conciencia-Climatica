import { Empleado } from "../domain/empleado.js";
import { EmpleadoPort } from "../domain/empleadoPort.js";

export class EmpleadoApplication {
    private port: EmpleadoPort;

    constructor(port: EmpleadoPort) {
        this.port = port;
    }

    async createEmpleado(empleado: Empleado): Promise<number> {
        return this.port.createEmpleado(empleado);
    }

    async getEmpleadoById(id: number): Promise<Empleado | null> {
        return await this.port.getEmpleadoById(id);
    }

    async getAllEmpleados(): Promise<Empleado[]> {
        return await this.port.getEmpleadoAllEmpleado();
    }

    async updateEmpleado(id: number, empleado: Partial<Empleado>): Promise<boolean> {
        const existingEmpleado = await this.port.getEmpleadoById(id);
        if (!existingEmpleado) {
            throw new Error("No se puede actualizar porque el empleado no existe");
        }
        return this.port.updateEmpleado(id, empleado);
    }

    async deleteEmpleado(id: number): Promise<boolean> {
        const existingEmpleado = await this.port.getEmpleadoById(id);
        if (!existingEmpleado) {
            throw new Error("No es posible borrar el empleado porque no existe");
        }
        return await this.port.deleteEmpleado(id);
    }
}
