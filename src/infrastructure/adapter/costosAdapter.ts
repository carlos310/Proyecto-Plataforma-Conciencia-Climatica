import { Repository } from 'typeorm';
import { Costo as CostoDomain } from '../../domain/costos.js';
import {Costos as CostoEntity} from '../entities/costos.js';
import { CostoPort } from '../../domain/costosPort.js';
import { AppDataSource } from '../config/data-base.js';
import { fechaLocal } from '../util/fecha-local.js';
//esta capa de adaptadores siempre requieren de implementar los puertos
//esta capa de adaptaadores son los encargados de hacer el cambio de informacion directamente con la base de datos  atravezz del typeorm
export class CostoAdapter implements CostoPort{
    private CostoRepository:Repository<CostoEntity>;// se usa repository ppara indicar dentro de el la clase con la que se va a hacer el intercambio, el repository hace el crud de la entidad que contiene
    constructor(){
        this.CostoRepository=AppDataSource.getRepository(CostoEntity);//se usa la entidad definida puesto que esta trae los datos de la base de datos
    }
    //se usa tanto el domain como el entity con el fin de transformar su información y generar una comunicación entre ellos con el fin de poder passar información de un lado a otro
    private toDomain(Costo:CostoEntity):CostoDomain{
        //se especifican los nombres de los datos primero de CostoDomain : y CostoEntity para hacer la igualación
        return{
            id:Costo.cos_id,
            description:Costo.cos_descripcion,
            value:Costo.cos_monto,
            date:Costo.cos_fecha,
            source:Costo.cos_fuente,
            empId:Costo.emp_id,
            usuId:Costo.usu_id,
            
        }
    }
    //se pasan los datos del dominio a modelo entidad
    private toEntity(Costo:Omit<CostoDomain, "id">):CostoEntity{
        const costoEntity= new CostoEntity();
        costoEntity.cos_descripcion= Costo.description;
        costoEntity.cos_monto= Costo.value;
        costoEntity.cos_fecha= fechaLocal(Costo.date);
        costoEntity.cos_fuente=Costo.source;
        costoEntity.emp_id=Costo.empId;
        costoEntity.usu_id= Costo.usuId;
        return costoEntity;
    }

    //se importan todas las funciones dentro de port puesto que en este caso se hace un contrato y el contrato 
    //acá se usa Costodomain puesto que es el que determina la interfaz de contrato que se va a usar
    async createCosto(Costo: Omit<CostoDomain, 'id'>): Promise<number> {
        try {
            const newCosto= this.toEntity(Costo);
            const savedCosto=await this.CostoRepository.save(newCosto);
            return savedCosto.cos_id;
        } catch (error) {
            console.log("Error creating the new Costo", error);
            throw new Error("Error creando el Costo");
        }
    }
    async updateCosto(id: number, Costo: Partial<CostoDomain>): Promise<boolean> {
        try {
            const existingCosto=await this.CostoRepository.findOne({where : {cos_id:id}});
            if(!existingCosto) return false;
            Object.assign(existingCosto, {
                cos_descripcion:Costo.description ?? existingCosto.cos_descripcion,
                cos_monto:Costo.value??existingCosto.cos_monto,
                cos_fecha:Costo.date ? fechaLocal(Costo.date) : existingCosto.cos_fecha,
                cos_fuente:Costo.source ?? existingCosto.cos_fuente,
                emp_id:Costo.empId ?? existingCosto.emp_id,
                usu_id: Costo.usuId ?? existingCosto.usu_id,
            });
            await this.CostoRepository.save(existingCosto);
            return true;
            
        } catch (error) {
            console.log("Error updating the new Costo", error);
            throw new Error("Error actualizando el Costo");
        }
    }
    async deleteCosto(id: number): Promise<boolean> {
        try {
            const existingCosto= await this.CostoRepository.findOne({where : {cos_id:id}});
            if(!existingCosto) return false;
            await this.CostoRepository.delete({ cos_id: id });
            return true;
        } catch (error) {
            console.log("Error creating the new Costo", error);
            throw new Error("Error creando el Costo");
        }
    }
    async getCostoById(id: number): Promise<CostoDomain | null> {
        try {
            const existingCosto= await this.CostoRepository.findOne({where : {cos_id:id}});
            return existingCosto? this.toDomain(existingCosto):null;
        } catch (error) {
            console.log("Error finding the new Costo", error);
            throw new Error("Error encontrando el Costo");
        }
    }
    
    async getCostoAllCosto(): Promise<CostoDomain[]> {
        try {
            const existingCosto= await this.CostoRepository.find();
            return existingCosto.map(this.toDomain);
        } catch (error) {
            console.log("Error finding Costos", error);
            throw new Error("Error encontrando Costos");
        }
    }
    

}