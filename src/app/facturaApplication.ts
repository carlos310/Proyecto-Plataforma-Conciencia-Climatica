import { Factura } from "../domain/factura.js";
import { FacturaPort } from "../domain/facturaPort.js";

export class FacturaApplication {
    private port: FacturaPort;

    constructor(port: FacturaPort) {
        this.port = port;
    }

    async createFactura(factura: Factura): Promise<number> {
        return this.port.createFactura(factura);
    }

    async getFacturaById(id: number): Promise<Factura | null> {
        return await this.port.getFacturaById(id);
    }

    async getAllFacturas(): Promise<Factura[]> {
        return await this.port.getFacturaAllFactura();
    }

    async updateFactura(id: number, factura: Partial<Factura>): Promise<boolean> {
        const existingFactura = await this.port.getFacturaById(id);
        if (!existingFactura) {
            throw new Error("No se puede actualizar porque la factura no existe");
        }
        return this.port.updateFactura(id, factura);
    }

    async deleteFactura(id: number): Promise<boolean> {
        const existingFactura = await this.port.getFacturaById(id);
        if (!existingFactura) {
            throw new Error("No es posible borrar la factura porque no existe");
        }
        return await this.port.deleteFactura(id);
    }
}
