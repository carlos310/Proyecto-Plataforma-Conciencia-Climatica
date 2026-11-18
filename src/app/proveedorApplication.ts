import { Proveedor } from "../domain/proveedor.js";
import { ProveedorPort } from "../domain/proveedorPort.js";

export class ProveedorApplication {
    private port: ProveedorPort;

    constructor(port: ProveedorPort) {
        this.port = port;
    }

    async createProveedor(proveedor: Proveedor): Promise<number> {
        return this.port.createProveedor(proveedor);
    }

    async getProveedorById(id: number): Promise<Proveedor | null> {
        return await this.port.getProveedorById(id);
    }

    async getAllProveedores(): Promise<Proveedor[]> {
        return await this.port.getProveedorAllProveedor();
    }

    async updateProveedor(id: number, proveedor: Partial<Proveedor>): Promise<boolean> {
        const existingProveedor = await this.port.getProveedorById(id);
        if (!existingProveedor) {
            throw new Error("No se puede actualizar porque el proveedor no existe");
        }
        return this.port.updateProveedor(id, proveedor);
    }

    async deleteProveedor(id: number): Promise<boolean> {
        const existingProveedor = await this.port.getProveedorById(id);
        if (!existingProveedor) {
            throw new Error("No es posible borrar el proveedor porque no existe");
        }
        return await this.port.deleteProveedor(id);
    }
}
