import { Repository } from 'typeorm';
import { Empleado as EmpleadoDomain } from '../../domain/empleado.js';
import { Empleado as EmpleadoEntity } from '../entities/empleado.js';
import { EmpleadoPort } from '../../domain/empleadoPort.js';
import { AppDataSource } from '../config/data-base.js';
import { fechaLocal } from '../util/fecha-local.js';

export class EmpleadoAdapter implements EmpleadoPort {
    private EmpleadoRepository: Repository<EmpleadoEntity>;

    constructor() {
        this.EmpleadoRepository = AppDataSource.getRepository(EmpleadoEntity);
    }

    private toDomain(Empleado: EmpleadoEntity): EmpleadoDomain {
        return {
            id: Empleado.emp_id,
            nombre: Empleado.emp_nombre,
            apellido: Empleado.emp_apellido,
            cargo: Empleado.emp_cargo,
            salario: Empleado.emp_salario,
            fechaContratacion: Empleado.emp_fecha_contratacion,
            usuId: Empleado.usu_id,
            rol: Empleado.emp_rol,
        };
    }

    private toEntity(Empleado: Omit<EmpleadoDomain, "id">): EmpleadoEntity {
        const empleadoEntity = new EmpleadoEntity();
        empleadoEntity.emp_nombre = Empleado.nombre;
        empleadoEntity.emp_apellido = Empleado.apellido;
        empleadoEntity.emp_cargo = Empleado.cargo;
        empleadoEntity.emp_salario = Empleado.salario;
        empleadoEntity.emp_fecha_contratacion = fechaLocal(Empleado.fechaContratacion);
        empleadoEntity.usu_id = Empleado.usuId;
        empleadoEntity.emp_rol = Empleado.rol;
        return empleadoEntity;
    }

    async createEmpleado(Empleado: Omit<EmpleadoDomain, 'id'>): Promise<number> {
        try {
            const newEmpleado = this.toEntity(Empleado);
            const savedEmpleado = await this.EmpleadoRepository.save(newEmpleado);
            return savedEmpleado.emp_id;
        } catch (error) {
            console.log("Error creating the new Empleado", error);
            throw new Error("Error creando el empleado");
        }
    }

    async updateEmpleado(id: number, Empleado: Partial<EmpleadoDomain>): Promise<boolean> {
        try {
            const existingEmpleado = await this.EmpleadoRepository.findOne({ where: { emp_id: id } });
            if (!existingEmpleado) return false;
            Object.assign(existingEmpleado, {
                emp_nombre: Empleado.nombre ?? existingEmpleado.emp_nombre,
                emp_apellido: Empleado.apellido ?? existingEmpleado.emp_apellido,
                emp_cargo: Empleado.cargo ?? existingEmpleado.emp_cargo,
                emp_salario: Empleado.salario ?? existingEmpleado.emp_salario,
                emp_fecha_contratacion: Empleado.fechaContratacion ? fechaLocal(Empleado.fechaContratacion) : existingEmpleado.emp_fecha_contratacion,
                usu_id: Empleado.usuId ?? existingEmpleado.usu_id,
                emp_rol: Empleado.rol ?? existingEmpleado.emp_rol,
            });
            await this.EmpleadoRepository.save(existingEmpleado);
            return true;
        } catch (error) {
            console.log("Error updating the new Empleado", error);
            throw new Error("Error actualizando el empleado");
        }
    }

    async deleteEmpleado(id: number): Promise<boolean> {
        try {
            const existingEmpleado = await this.EmpleadoRepository.findOne({ where: { emp_id: id } });
            if (!existingEmpleado) return false;
            await this.EmpleadoRepository.delete({ emp_id: id });
            return true;
        } catch (error) {
            console.log("Error deleting the new Empleado", error);
            throw new Error("Error eliminando el empleado");
        }
    }

    async getEmpleadoById(id: number): Promise<EmpleadoDomain | null> {
        try {
            const existingEmpleado = await this.EmpleadoRepository.findOne({ where: { emp_id: id } });
            return existingEmpleado ? this.toDomain(existingEmpleado) : null;
        } catch (error) {
            console.log("Error finding the new Empleado", error);
            throw new Error("Error encontrando el empleado");
        }
    }

    async getEmpleadoAllEmpleado(): Promise<EmpleadoDomain[]> {
        try {
            const existingEmpleado = await this.EmpleadoRepository.find();
            return existingEmpleado.map(e => this.toDomain(e));
        } catch (error) {
            console.log("Error finding Empleados", error);
            throw new Error("Error encontrando empleados");
        }
    }
}
