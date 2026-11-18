import { Cliente } from "../domain/cliente.js";
import { ClientePort } from "../domain/clientePort.js";

export class ClienteApplication {
    private port: ClientePort;

    constructor(port: ClientePort) {
        this.port = port;
    }

    async createCliente(cliente: Cliente): Promise<number> {
        return this.port.createCliente(cliente);
    }

    async getClienteById(id: number): Promise<Cliente | null> {
        return await this.port.getClienteById(id);
    }

    async getAllClientes(): Promise<Cliente[]> {
        return await this.port.getClienteAllCliente();
    }

    async updateCliente(id: number, cliente: Partial<Cliente>): Promise<boolean> {
        const existingCliente = await this.port.getClienteById(id);
        if (!existingCliente) {
            throw new Error("No se puede actualizar porque el cliente no existe");
        }
        return this.port.updateCliente(id, cliente);
    }

    async deleteCliente(id: number): Promise<boolean> {
        const existingCliente = await this.port.getClienteById(id);
        if (!existingCliente) {
            throw new Error("No es posible borrar el cliente porque no existe");
        }
        return await this.port.deleteCliente(id);
    }
}
