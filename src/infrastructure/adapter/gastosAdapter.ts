import { Repository } from 'typeorm';
import { Gasto as GastoDomain } from '../../domain/gastos.js';
import {Gastos as GastoEntity} from '../entities/gastos.js';
import { GastoPort } from '../../domain/gastosPort.js';
import { AppDataSource } from '../config/data-base.js';
import { fechaLocal } from '../util/fecha-local.js';
//esta capa de adaptadores siempre requieren de implementar los puertos
//esta capa de adaptaadores son los encargados de hacer el cambio de informacion directamente con la base de datos  atravezz del typeorm
export class GastoAdapter implements GastoPort{
    private GastoRepository:Repository<GastoEntity>;// se usa repository ppara indicar dentro de el la clase con la que se va a hacer el intercambio, el repository hace el crud de la entidad que contiene
    constructor(){
        this.GastoRepository=AppDataSource.getRepository(GastoEntity);//se usa la entidad definida puesto que esta trae los datos de la base de datos
    }
    //se usa tanto el domain como el entity con el fin de transformar su información y generar una comunicación entre ellos con el fin de poder passar información de un lado a otro
    private toDomain(Gasto:GastoEntity):GastoDomain{
        //se especifican los nombres de los datos primero de GastoDomain : y GastoEntity para hacer la igualación
        return{
            id:Gasto.gas_id,
            description:Gasto.gas_descripcion,
            value:Gasto.gas_monto,
            date:Gasto.gas_fecha,
            empId:Gasto.emp_id,
            usuId:Gasto.usu_id,
            
        }
    }
    //se pasan los datos del dominio a modelo entidad
    private toEntity(Gasto:Omit<GastoDomain, "id">):GastoEntity{
        const gastoEntity= new GastoEntity();
        gastoEntity.gas_descripcion= Gasto.description;
        gastoEntity.gas_monto= Gasto.value;
        gastoEntity.gas_fecha= fechaLocal(Gasto.date);
        gastoEntity.emp_id=Gasto.empId;
        gastoEntity.usu_id= Gasto.usuId;
        return gastoEntity;
    }

    //se importan todas las funciones dentro de port puesto que en este caso se hace un contrato y el contrato 
    //acá se usa Gastodomain puesto que es el que determina la interfaz de contrato que se va a usar
    async createGasto(Gasto: Omit<GastoDomain, 'id'>): Promise<number> {
        try {
            const newGasto= this.toEntity(Gasto);
            const savedGasto=await this.GastoRepository.save(newGasto);
            return savedGasto.gas_id;
        } catch (error) {
            console.log("Error creating the new Gasto", error);
            throw new Error("Error creando el Gasto");
        }
    }
    async updateGasto(id: number, Gasto: Partial<GastoDomain>): Promise<boolean> {
        try {
            const existingGasto=await this.GastoRepository.findOne({where : {gas_id:id}});
            if(!existingGasto) return false;
            Object.assign(existingGasto, {
                gas_descripcion:Gasto.description ?? existingGasto.gas_descripcion,
                gas_monto:Gasto.value??existingGasto.gas_monto,
                gas_fecha:Gasto.date ? fechaLocal(Gasto.date) : existingGasto.gas_fecha,
                emp_id:Gasto.empId ?? existingGasto.emp_id,
                usu_id: Gasto.usuId ?? existingGasto.usu_id,
            });
            await this.GastoRepository.save(existingGasto);
            return true;
            
        } catch (error) {
            console.log("Error updating the new Gasto", error);
            throw new Error("Error actualizando el Gasto");
        }
    }
    async deleteGasto(id: number): Promise<boolean> {
        try {
            const existingGasto= await this.GastoRepository.findOne({where : {gas_id:id}});
            if(!existingGasto) return false;
            await this.GastoRepository.delete({ gas_id: id });
            return true;
        } catch (error) {
            console.log("Error creating the new Gasto", error);
            throw new Error("Error creando el Gasto");
        }
    }
    async getGastoById(id: number): Promise<GastoDomain | null> {
        try {
            const existingGasto= await this.GastoRepository.findOne({where : {gas_id:id}});
            return existingGasto? this.toDomain(existingGasto):null;
        } catch (error) {
            console.log("Error finding the new Gasto", error);
            throw new Error("Error encontrando el Gasto");
        }
    }
    
    async getGastoAllGasto(): Promise<GastoDomain[]> {
        try {
            const existingGasto= await this.GastoRepository.find();
            return existingGasto.map(this.toDomain);
        } catch (error) {
            console.log("Error finding Gastos", error);
            throw new Error("Error encontrando Gastos");
        }
    }
    

}