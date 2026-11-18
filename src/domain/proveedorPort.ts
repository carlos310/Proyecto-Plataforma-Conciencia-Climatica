import { Proveedor } from './proveedor.js';

export interface ProveedorPort {
    createProveedor(proveedor: Omit<Proveedor, 'id'>): Promise<number>;
    updateProveedor(id: number, proveedor: Partial<Proveedor>): Promise<boolean>;
    deleteProveedor(id: number): Promise<boolean>;
    getProveedorById(id: number): Promise<Proveedor | null>;
    getProveedorAllProveedor(): Promise<Proveedor[]>;
}
