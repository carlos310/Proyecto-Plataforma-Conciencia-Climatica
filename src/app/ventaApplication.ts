import { Venta } from "../domain/venta.js";
import { VentaPort } from "../domain/ventaPort.js";

export class VentaApplication {
    private port: VentaPort;

    constructor(port: VentaPort) {
        this.port = port;
    }

    async createVenta(venta: Venta): Promise<number> {
        return this.port.createVenta(venta);
    }

    async getVentaById(id: number): Promise<Venta | null> {
        return await this.port.getVentaById(id);
    }

    async getAllVentas(): Promise<Venta[]> {
        return await this.port.getVentaAllVenta();
    }

    async updateVenta(id: number, venta: Partial<Venta>): Promise<boolean> {
        const existingVenta = await this.port.getVentaById(id);
        if (!existingVenta) {
            throw new Error("No se puede actualizar porque la venta no existe");
        }
        return this.port.updateVenta(id, venta);
    }

    async deleteVenta(id: number): Promise<boolean> {
        const existingVenta = await this.port.getVentaById(id);
        if (!existingVenta) {
            throw new Error("No es posible borrar la venta porque no existe");
        }
        return await this.port.deleteVenta(id);
    }
}
