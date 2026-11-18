import { Repository } from 'typeorm';
import { Factura as FacturaDomain } from '../../domain/factura.js';
import { Factura as FacturaEntity } from '../entities/factura.js';
import { FacturaPort } from '../../domain/facturaPort.js';
import { AppDataSource } from '../config/data-base.js';
import { fechaLocal } from '../util/fecha-local.js';

// La base de datos solo acepta tipo y estado en MAYÚSCULAS (facturas_fac_tipo_check / facturas_fac_estado_check),
// mientras que la validación y el front trabajan en minúsculas. La conversión se hace solo aquí.
const aBD = (valor: string) => valor.trim().toUpperCase();
const aDominio = (valor: string) => valor?.toLowerCase();

export class FacturaAdapter implements FacturaPort {
    private FacturaRepository: Repository<FacturaEntity>;

    constructor() {
        this.FacturaRepository = AppDataSource.getRepository(FacturaEntity);
    }

    private toDomain(Factura: FacturaEntity): FacturaDomain {
        return {
            id: Factura.fac_id,
            tipo: aDominio(Factura.fac_tipo),
            referenciaId: Factura.fac_referencia_id,
            fecha: Factura.fac_fecha,
            total: Factura.fac_total,
            cantidad: Factura.fac_cantidad,
            estado: aDominio(Factura.fac_estado),
            proveedorCliente: Factura.fac_proveedor_cliente,
            usuId: Factura.usu_id,
            loteId: Factura.fac_lote_id,
        };
    }

    private toEntity(Factura: Omit<FacturaDomain, "id">): FacturaEntity {
        const facturaEntity = new FacturaEntity();
        facturaEntity.fac_tipo = aBD(Factura.tipo);
        facturaEntity.fac_referencia_id = Factura.referenciaId;
        facturaEntity.fac_fecha = fechaLocal(Factura.fecha);
        facturaEntity.fac_total = Factura.total;
        facturaEntity.fac_cantidad = Factura.cantidad;
        facturaEntity.fac_estado = aBD(Factura.estado);
        facturaEntity.fac_proveedor_cliente = Factura.proveedorCliente;
        facturaEntity.usu_id = Factura.usuId;
        facturaEntity.fac_lote_id = Factura.loteId;
        return facturaEntity;
    }

    async createFactura(Factura: Omit<FacturaDomain, 'id'>): Promise<number> {
        try {
            const newFactura = this.toEntity(Factura);
            const savedFactura = await this.FacturaRepository.save(newFactura);
            return savedFactura.fac_id;
        } catch (error) {
            console.log("Error creating the new Factura", error);
            throw new Error("Error creando la factura");
        }
    }

    async updateFactura(id: number, Factura: Partial<FacturaDomain>): Promise<boolean> {
        try {
            const existingFactura = await this.FacturaRepository.findOne({ where: { fac_id: id } });
            if (!existingFactura) return false;
            Object.assign(existingFactura, {
                fac_tipo: Factura.tipo ? aBD(Factura.tipo) : existingFactura.fac_tipo,
                fac_referencia_id: Factura.referenciaId ?? existingFactura.fac_referencia_id,
                fac_fecha: Factura.fecha ? fechaLocal(Factura.fecha) : existingFactura.fac_fecha,
                fac_total: Factura.total ?? existingFactura.fac_total,
                fac_cantidad: Factura.cantidad ?? existingFactura.fac_cantidad,
                fac_estado: Factura.estado ? aBD(Factura.estado) : existingFactura.fac_estado,
                fac_proveedor_cliente: Factura.proveedorCliente ?? existingFactura.fac_proveedor_cliente,
                usu_id: Factura.usuId ?? existingFactura.usu_id,
                fac_lote_id: Factura.loteId ?? existingFactura.fac_lote_id,
            });
            await this.FacturaRepository.save(existingFactura);
            return true;
        } catch (error) {
            console.log("Error updating the new Factura", error);
            throw new Error("Error actualizando la factura");
        }
    }

    async deleteFactura(id: number): Promise<boolean> {
        try {
            const existingFactura = await this.FacturaRepository.findOne({ where: { fac_id: id } });
            if (!existingFactura) return false;
            await this.FacturaRepository.delete({ fac_id: id });
            return true;
        } catch (error) {
            console.log("Error deleting the new Factura", error);
            throw new Error("Error eliminando la factura");
        }
    }

    async getFacturaById(id: number): Promise<FacturaDomain | null> {
        try {
            const existingFactura = await this.FacturaRepository.findOne({ where: { fac_id: id } });
            return existingFactura ? this.toDomain(existingFactura) : null;
        } catch (error) {
            console.log("Error finding the new Factura", error);
            throw new Error("Error encontrando la factura");
        }
    }

    async getFacturaAllFactura(): Promise<FacturaDomain[]> {
        try {
            const existingFactura = await this.FacturaRepository.find();
            return existingFactura.map(f => this.toDomain(f));
        } catch (error) {
            console.log("Error finding Facturas", error);
            throw new Error("Error encontrando facturas");
        }
    }
}
