export interface Factura {
    id: number;
    tipo: string;
    referenciaId: number;
    fecha: Date;
    total: number;
    cantidad: number;
    estado: string;
    proveedorCliente: string;
    usuId: number;
    loteId: string;
}
