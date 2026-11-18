import { Repository } from 'typeorm';
import { Compra as CompraDomain } from '../../domain/compras.js';
import {Compras as CompraEntity} from '../entities/compras.js';
import { CompraPort } from '../../domain/comprasPort.js';
import { AppDataSource } from '../config/data-base.js';
import { fechaLocal } from '../util/fecha-local.js';

// Postgres responde con código 23503 cuando el proveedor o el usuario indicado no existe (llave foránea).
// Se traduce a un mensaje que el front pueda mostrar en lugar del error genérico.
function mensajeLlaveForanea(error: unknown): string | null {
    const e = error as { code?: string; detail?: string; driverError?: { code?: string; detail?: string } };
    const code = e?.code ?? e?.driverError?.code;
    if (code !== '23503') return null;
    const detail = e.detail ?? e.driverError?.detail ?? '';
    if (detail.includes('prov_id')) return 'El proveedor indicado no existe. Verifica el ID del proveedor.';
    if (detail.includes('usu_id')) return 'El usuario indicado no existe. Verifica el ID del usuario.';
    return 'Uno de los registros relacionados con la compra no existe.';
}
//esta capa de adaptadores siempre requieren de implementar los puertos
//esta capa de adaptaadores son los encargados de hacer el cambio de informacion directamente con la base de datos  atravezz del typeorm
export class CompraAdapter implements CompraPort{
    private CompraRepository:Repository<CompraEntity>;// se usa repository ppara indicar dentro de el la clase con la que se va a hacer el intercambio, el repository hace el crud de la entidad que contiene
    constructor(){
        this.CompraRepository=AppDataSource.getRepository(CompraEntity);//se usa la entidad definida puesto que esta trae los datos de la base de datos
    }
    //se usa tanto el domain como el entity con el fin de transformar su información y generar una comunicación entre ellos con el fin de poder passar información de un lado a otro
    private toDomain(Compra:CompraEntity):CompraDomain{
        //se especifican los nombres de los datos primero de CompraDomain : y CompraEntity para hacer la igualación
        return{
            id:Compra.cpr_id,
            total:Compra.cpr_total,
            quantity:Compra.cpr_cantidad,
            date:Compra.cpr_fecha,
            providerId:Compra.prov_id,
            usuId:Compra.usu_id,

        }
    }
    //se pasan los datos del dominio a modelo entidad
    private toEntity(Compra:Omit<CompraDomain, "id">):CompraEntity{
        const compraEntity= new CompraEntity();
        compraEntity.cpr_total= Compra.total;
        compraEntity.cpr_cantidad= Compra.quantity;
        compraEntity.cpr_fecha= fechaLocal(Compra.date);
        compraEntity.prov_id=Compra.providerId;
        compraEntity.usu_id= Compra.usuId;
        return compraEntity;
    }

    //se importan todas las funciones dentro de port puesto que en este caso se hace un contrato y el contrato 
    //acá se usa Compradomain puesto que es el que determina la interfaz de contrato que se va a usar
    async createCompra(Compra: Omit<CompraDomain, 'id'>): Promise<number> {
        try {
            const newCompra= this.toEntity(Compra);
            const savedCompra=await this.CompraRepository.save(newCompra);
            return savedCompra.cpr_id;
        } catch (error) {
            console.log("Error creating the new Compra", error);
            throw new Error(mensajeLlaveForanea(error) ?? "Error creando la compra");
        }
    }
    async updateCompra(id: number, Compra: Partial<CompraDomain>): Promise<boolean> {
        try {
            const existingCompra=await this.CompraRepository.findOne({where : {cpr_id:id}});
            if(!existingCompra) return false;
            Object.assign(existingCompra, {
                cpr_total:Compra.total ?? existingCompra.cpr_total,
                cpr_cantidad:Compra.quantity??existingCompra.cpr_cantidad,
                cpr_fecha:Compra.date ? fechaLocal(Compra.date) : existingCompra.cpr_fecha,
                prov_id:Compra.providerId ?? existingCompra.prov_id,
                usu_id: Compra.usuId ?? existingCompra.usu_id,
            });
            await this.CompraRepository.save(existingCompra);
            return true;

        } catch (error) {
            console.log("Error updating the new Compra", error);
            throw new Error(mensajeLlaveForanea(error) ?? "Error actualizando la compra");
        }
    }
    async deleteCompra(id: number): Promise<boolean> {
        try {
            const existingCompra= await this.CompraRepository.findOne({where : {cpr_id:id}});
            if(!existingCompra) return false;
            await this.CompraRepository.delete({ cpr_id: id });
            return true;
        } catch (error) {
            console.log("Error creating the new Compra", error);
            throw new Error("Error creando el Compra");
        }
    }
    async getCompraById(id: number): Promise<CompraDomain | null> {
        try {
            const existingCompra= await this.CompraRepository.findOne({where : {cpr_id:id}});
            return existingCompra? this.toDomain(existingCompra):null;
        } catch (error) {
            console.log("Error finding the new Compra", error);
            throw new Error("Error encontrando el Compra");
        }
    }
    
    async getCompraAllCompra(): Promise<CompraDomain[]> {
        try {
            const existingCompra= await this.CompraRepository.find();
            return existingCompra.map(c => this.toDomain(c));
        } catch (error) {
            console.log("Error finding Compras", error);
            throw new Error("Error encontrando Compras");
        }
    }
    

}