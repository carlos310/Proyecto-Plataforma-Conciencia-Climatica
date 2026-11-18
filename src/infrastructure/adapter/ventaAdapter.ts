import { Repository } from 'typeorm';
import { Venta as VentaDomain } from '../../domain/venta.js';
import { Venta as VentaEntity } from '../entities/venta.js';
import { VentaPort } from '../../domain/ventaPort.js';
import { AppDataSource } from '../config/data-base.js';
import { fechaLocal } from '../util/fecha-local.js';

export class VentaAdapter implements VentaPort {
    private VentaRepository: Repository<VentaEntity>;

    constructor() {
        this.VentaRepository = AppDataSource.getRepository(VentaEntity);
    }

    private toDomain(Venta: VentaEntity): VentaDomain {
        return {
            id: Venta.ven_id,
            total: Venta.ven_total,
            cantidad: Venta.ven_cantidad,
            fecha: Venta.ven_fecha,
            clienteId: Venta.cli_id,
            usuId: Venta.usu_id,
        };
    }

    private toEntity(Venta: Omit<VentaDomain, "id">): VentaEntity {
        const ventaEntity = new VentaEntity();
        ventaEntity.ven_total = Venta.total;
        ventaEntity.ven_cantidad = Venta.cantidad;
        ventaEntity.ven_fecha = fechaLocal(Venta.fecha);
        ventaEntity.cli_id = Venta.clienteId;
        ventaEntity.usu_id = Venta.usuId;
        return ventaEntity;
    }

    async createVenta(Venta: Omit<VentaDomain, 'id'>): Promise<number> {
        try {
            const newVenta = this.toEntity(Venta);
            const savedVenta = await this.VentaRepository.save(newVenta);
            return savedVenta.ven_id;
        } catch (error) {
            console.log("Error creating the new Venta", error);
            throw new Error("Error creando la venta");
        }
    }

    async updateVenta(id: number, Venta: Partial<VentaDomain>): Promise<boolean> {
        try {
            const existingVenta = await this.VentaRepository.findOne({ where: { ven_id: id } });
            if (!existingVenta) return false;
            Object.assign(existingVenta, {
                ven_total: Venta.total ?? existingVenta.ven_total,
                ven_cantidad: Venta.cantidad ?? existingVenta.ven_cantidad,
                ven_fecha: Venta.fecha ? fechaLocal(Venta.fecha) : existingVenta.ven_fecha,
                cli_id: Venta.clienteId ?? existingVenta.cli_id,
                usu_id: Venta.usuId ?? existingVenta.usu_id,
            });
            await this.VentaRepository.save(existingVenta);
            return true;
        } catch (error) {
            console.log("Error updating the new Venta", error);
            throw new Error("Error actualizando la venta");
        }
    }

    async deleteVenta(id: number): Promise<boolean> {
        try {
            const existingVenta = await this.VentaRepository.findOne({ where: { ven_id: id } });
            if (!existingVenta) return false;
            await this.VentaRepository.delete({ ven_id: id });
            return true;
        } catch (error) {
            console.log("Error deleting the new Venta", error);
            throw new Error("Error eliminando la venta");
        }
    }

    async getVentaById(id: number): Promise<VentaDomain | null> {
        try {
            const existingVenta = await this.VentaRepository.findOne({ where: { ven_id: id } });
            return existingVenta ? this.toDomain(existingVenta) : null;
        } catch (error) {
            console.log("Error finding the new Venta", error);
            throw new Error("Error encontrando la venta");
        }
    }

    async getVentaAllVenta(): Promise<VentaDomain[]> {
        try {
            const existingVenta = await this.VentaRepository.find();
            return existingVenta.map(v => this.toDomain(v));
        } catch (error) {
            console.log("Error finding Ventas", error);
            throw new Error("Error encontrando ventas");
        }
    }
}
