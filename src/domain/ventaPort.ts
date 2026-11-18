import { Venta } from './venta.js';

export interface VentaPort {
    createVenta(venta: Omit<Venta, 'id'>): Promise<number>;
    updateVenta(id: number, venta: Partial<Venta>): Promise<boolean>;
    deleteVenta(id: number): Promise<boolean>;
    getVentaById(id: number): Promise<Venta | null>;
    getVentaAllVenta(): Promise<Venta[]>;
}
