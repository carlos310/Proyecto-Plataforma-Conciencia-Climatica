import { Cliente } from './cliente.js';

export interface ClientePort {
    createCliente(cliente: Omit<Cliente, 'id'>): Promise<number>;
    updateCliente(id: number, cliente: Partial<Cliente>): Promise<boolean>;
    deleteCliente(id: number): Promise<boolean>;
    getClienteById(id: number): Promise<Cliente | null>;
    getClienteAllCliente(): Promise<Cliente[]>;
}
