import { Factura } from './factura.js';

export interface FacturaPort {
    createFactura(factura: Omit<Factura, 'id'>): Promise<number>;
    updateFactura(id: number, factura: Partial<Factura>): Promise<boolean>;
    deleteFactura(id: number): Promise<boolean>;
    getFacturaById(id: number): Promise<Factura | null>;
    getFacturaAllFactura(): Promise<Factura[]>;
}
