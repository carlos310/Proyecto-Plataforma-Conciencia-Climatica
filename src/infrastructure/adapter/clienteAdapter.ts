import { Repository } from 'typeorm';
import { Cliente as ClienteDomain } from '../../domain/cliente.js';
import { Cliente as ClienteEntity } from '../entities/cliente.js';
import { ClientePort } from '../../domain/clientePort.js';
import { AppDataSource } from '../config/data-base.js';

export class ClienteAdapter implements ClientePort {
    private ClienteRepository: Repository<ClienteEntity>;

    constructor() {
        this.ClienteRepository = AppDataSource.getRepository(ClienteEntity);
    }

    private toDomain(Cliente: ClienteEntity): ClienteDomain {
        return {
            id: Cliente.cli_id,
            nombre: Cliente.cli_nombre,
            apellido: Cliente.cli_apellido,
            email: Cliente.cli_email,
            telefono: Cliente.cli_telefono,
            direccion: Cliente.cli_direccion,
            usuId: Cliente.usu_id,
            rol: Cliente.cli_rol,
        };
    }

    private toEntity(Cliente: Omit<ClienteDomain, "id">): ClienteEntity {
        const clienteEntity = new ClienteEntity();
        clienteEntity.cli_nombre = Cliente.nombre;
        clienteEntity.cli_apellido = Cliente.apellido;
        clienteEntity.cli_email = Cliente.email;
        clienteEntity.cli_telefono = Cliente.telefono;
        clienteEntity.cli_direccion = Cliente.direccion;
        clienteEntity.usu_id = Cliente.usuId;
        clienteEntity.cli_rol = Cliente.rol;
        return clienteEntity;
    }

    async createCliente(Cliente: Omit<ClienteDomain, 'id'>): Promise<number> {
        try {
            const newCliente = this.toEntity(Cliente);
            const savedCliente = await this.ClienteRepository.save(newCliente);
            return savedCliente.cli_id;
        } catch (error) {
            console.log("Error creating the new Cliente", error);
            throw new Error("Error creando el cliente");
        }
    }

    async updateCliente(id: number, Cliente: Partial<ClienteDomain>): Promise<boolean> {
        try {
            const existingCliente = await this.ClienteRepository.findOne({ where: { cli_id: id } });
            if (!existingCliente) return false;
            Object.assign(existingCliente, {
                cli_nombre: Cliente.nombre ?? existingCliente.cli_nombre,
                cli_apellido: Cliente.apellido ?? existingCliente.cli_apellido,
                cli_email: Cliente.email ?? existingCliente.cli_email,
                cli_telefono: Cliente.telefono ?? existingCliente.cli_telefono,
                cli_direccion: Cliente.direccion ?? existingCliente.cli_direccion,
                usu_id: Cliente.usuId ?? existingCliente.usu_id,
                cli_rol: Cliente.rol ?? existingCliente.cli_rol,
            });
            await this.ClienteRepository.save(existingCliente);
            return true;
        } catch (error) {
            console.log("Error updating the new Cliente", error);
            throw new Error("Error actualizando el cliente");
        }
    }

    async deleteCliente(id: number): Promise<boolean> {
        try {
            const existingCliente = await this.ClienteRepository.findOne({ where: { cli_id: id } });
            if (!existingCliente) return false;
            await this.ClienteRepository.delete({ cli_id: id });
            return true;
        } catch (error) {
            console.log("Error deleting the new Cliente", error);
            throw new Error("Error eliminando el cliente");
        }
    }

    async getClienteById(id: number): Promise<ClienteDomain | null> {
        try {
            const existingCliente = await this.ClienteRepository.findOne({ where: { cli_id: id } });
            return existingCliente ? this.toDomain(existingCliente) : null;
        } catch (error) {
            console.log("Error finding the new Cliente", error);
            throw new Error("Error encontrando el cliente");
        }
    }

    async getClienteAllCliente(): Promise<ClienteDomain[]> {
        try {
            const existingCliente = await this.ClienteRepository.find();
            return existingCliente.map(c => this.toDomain(c));
        } catch (error) {
            console.log("Error finding Clientes", error);
            throw new Error("Error encontrando clientes");
        }
    }
}
