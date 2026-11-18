import { Repository } from 'typeorm';
import { Proveedor as ProveedorDomain } from '../../domain/proveedor.js';
import { Proveedor as ProveedorEntity } from '../entities/proveedor.js';
import { ProveedorPort } from '../../domain/proveedorPort.js';
import { AppDataSource } from '../config/data-base.js';

export class ProveedorAdapter implements ProveedorPort {
    private ProveedorRepository: Repository<ProveedorEntity>;

    constructor() {
        this.ProveedorRepository = AppDataSource.getRepository(ProveedorEntity);
    }

    private toDomain(Proveedor: ProveedorEntity): ProveedorDomain {
        return {
            id: Proveedor.prov_id,
            nombre: Proveedor.prov_nombre,
            email: Proveedor.prov_email,
            telefono: Proveedor.prov_telefono,
            direccion: Proveedor.prov_direccion,
            ciudad: Proveedor.prov_ciudad,
            pais: Proveedor.prov_pais,
            contacto: Proveedor.prov_contacto,
            estado: Proveedor.prov_estado,
        };
    }

    private toEntity(Proveedor: Omit<ProveedorDomain, "id">): ProveedorEntity {
        const proveedorEntity = new ProveedorEntity();
        proveedorEntity.prov_nombre = Proveedor.nombre;
        proveedorEntity.prov_email = Proveedor.email;
        proveedorEntity.prov_telefono = Proveedor.telefono;
        proveedorEntity.prov_direccion = Proveedor.direccion;
        proveedorEntity.prov_ciudad = Proveedor.ciudad;
        proveedorEntity.prov_pais = Proveedor.pais;
        proveedorEntity.prov_contacto = Proveedor.contacto;
        proveedorEntity.prov_estado = Proveedor.estado;
        return proveedorEntity;
    }

    async createProveedor(Proveedor: Omit<ProveedorDomain, 'id'>): Promise<number> {
        try {
            const newProveedor = this.toEntity(Proveedor);
            const savedProveedor = await this.ProveedorRepository.save(newProveedor);
            return savedProveedor.prov_id;
        } catch (error: any) {
            console.log("Error creating the new Proveedor", error);
            // PostgreSQL error code 23505 = unique_violation
            if (error?.code === '23505') {
                throw new Error("DUPLICATE_EMAIL: Ya existe un proveedor registrado con ese correo electrónico");
            }
            throw new Error("Error creando el proveedor");
        }
    }

    async updateProveedor(id: number, Proveedor: Partial<ProveedorDomain>): Promise<boolean> {
        try {
            const existingProveedor = await this.ProveedorRepository.findOne({ where: { prov_id: id } });
            if (!existingProveedor) return false;
            Object.assign(existingProveedor, {
                prov_nombre: Proveedor.nombre ?? existingProveedor.prov_nombre,
                prov_email: Proveedor.email ?? existingProveedor.prov_email,
                prov_telefono: Proveedor.telefono ?? existingProveedor.prov_telefono,
                prov_direccion: Proveedor.direccion ?? existingProveedor.prov_direccion,
                prov_ciudad: Proveedor.ciudad ?? existingProveedor.prov_ciudad,
                prov_pais: Proveedor.pais ?? existingProveedor.prov_pais,
                prov_contacto: Proveedor.contacto ?? existingProveedor.prov_contacto,
                prov_estado: Proveedor.estado ?? existingProveedor.prov_estado,
            });
            await this.ProveedorRepository.save(existingProveedor);
            return true;
        } catch (error) {
            console.log("Error updating the new Proveedor", error);
            throw new Error("Error actualizando el proveedor");
        }
    }

    async deleteProveedor(id: number): Promise<boolean> {
        try {
            const existingProveedor = await this.ProveedorRepository.findOne({ where: { prov_id: id } });
            if (!existingProveedor) return false;
            await this.ProveedorRepository.delete({ prov_id: id });
            return true;
        } catch (error) {
            console.log("Error deleting the new Proveedor", error);
            throw new Error("Error eliminando el proveedor");
        }
    }

    async getProveedorById(id: number): Promise<ProveedorDomain | null> {
        try {
            const existingProveedor = await this.ProveedorRepository.findOne({ where: { prov_id: id } });
            return existingProveedor ? this.toDomain(existingProveedor) : null;
        } catch (error) {
            console.log("Error finding the new Proveedor", error);
            throw new Error("Error encontrando el proveedor");
        }
    }

    async getProveedorAllProveedor(): Promise<ProveedorDomain[]> {
        try {
            const existingProveedor = await this.ProveedorRepository.find();
            return existingProveedor.map(p => this.toDomain(p));
        } catch (error) {
            console.log("Error finding Proveedores", error);
            throw new Error("Error encontrando proveedores");
        }
    }
}
