import { Repository } from 'typeorm';
import { Ingreso as IngresosDomain } from '../../domain/ingresos.js';
import {Ingresos as IngresosEntity} from '../entities/ingresos.js';
import { IngresoPort } from '../../domain/ingresosPort.js';
import { AppDataSource } from '../config/data-base.js';
import { fechaLocal } from '../util/fecha-local.js';
//esta capa de adaptadores siempre requieren de implementar los puertos
//esta capa de adaptaadores son los encargados de hacer el cambio de informacion directamente con la base de datos  atravezz del typeorm
export class IngresosAdapter implements IngresoPort{
    private IngresosRepository:Repository<IngresosEntity>;// se usa repository ppara indicar dentro de el la clase con la que se va a hacer el intercambio, el repository hace el crud de la entidad que contiene
    constructor(){
        this.IngresosRepository=AppDataSource.getRepository(IngresosEntity);//se usa la entidad definida puesto que esta trae los datos de la base de datos
    }
    //se usa tanto el domain como el entity con el fin de transformar su información y generar una comunicación entre ellos con el fin de poder passar información de un lado a otro
    private toDomain(Ingresos:IngresosEntity):IngresosDomain{
        //se especifican los nombres de los datos primero de IngresosDomain : y IngresosEntity para hacer la igualación
        return{
            id:Ingresos.ing_id,
            description:Ingresos.ing_descripcion,
            value:Ingresos.ing_monto,
            date:Ingresos.ing_fecha,
            source:Ingresos.ing_fuente,
            usuId:Ingresos.usu_id,
            
        }
    }
    //se pasan los datos del dominio a modelo entidad
    private toEntity(Ingresos:Omit<IngresosDomain, "id">):IngresosEntity{
        const ingresosEntity= new IngresosEntity();
        ingresosEntity.ing_descripcion= Ingresos.description;
        ingresosEntity.ing_monto= Ingresos.value;
        ingresosEntity.ing_fecha= fechaLocal(Ingresos.date);
        ingresosEntity.ing_fuente= Ingresos.source;
        ingresosEntity.usu_id= Ingresos.usuId;
        return ingresosEntity;
    }

    //se importan todas las funciones dentro de port puesto que en este caso se hace un contrato y el contrato 
    //acá se usa Ingresosdomain puesto que es el que determina la interfaz de contrato que se va a usar
    async createIngreso(Ingresos: Omit<IngresosDomain, 'id'>): Promise<number> {
        try {
            const newIngresos= this.toEntity(Ingresos);
            const savedIngresos=await this.IngresosRepository.save(newIngresos);
            return savedIngresos.ing_id;
        } catch (error) {
            console.log("Error creating the new Ingresos", error);
            throw new Error("Error creando el Ingresos");
        }
    }
    async updateIngreso(id: number, Ingresos: Partial<IngresosDomain>): Promise<boolean> {
        try {
            const existingIngresos=await this.IngresosRepository.findOne({where : {ing_id:id}});
            if(!existingIngresos) return false;
            Object.assign(existingIngresos, {
                ing_descripcion:Ingresos.description ?? existingIngresos.ing_descripcion,
                ing_monto:Ingresos.value??existingIngresos.ing_monto,
                ing_fecha:Ingresos.date ? fechaLocal(Ingresos.date) : existingIngresos.ing_fecha,
                ing_fuente: Ingresos.source ?? existingIngresos.ing_fuente,
                usu_id: Ingresos.usuId ?? existingIngresos.usu_id,
            });
            await this.IngresosRepository.save(existingIngresos);
            return true;
            
        } catch (error) {
            console.log("Error updating the new Ingresos", error);
            throw new Error("Error actualizando el Ingresos");
        }
    }
    async deleteIngreso(id: number): Promise<boolean> {
        try {
            const existingIngresos= await this.IngresosRepository.findOne({where : {ing_id:id}});
            if(!existingIngresos) return false;
            await this.IngresosRepository.delete({ ing_id: id });
            return true;
        } catch (error) {
            console.log("Error creating the new Ingresos", error);
            throw new Error("Error creando el Ingresos");
        }
    }
    async getIngresoById(id: number): Promise<IngresosDomain | null> {
        try {
            const existingIngresos= await this.IngresosRepository.findOne({where : {ing_id:id}});
            return existingIngresos? this.toDomain(existingIngresos):null;
        } catch (error) {
            console.log("Error finding the new Ingresos", error);
            throw new Error("Error encontrando el Ingresos");
        }
    }
    
    async getIngresoAllIngreso(): Promise<IngresosDomain[]> {
        try {
            const existingIngresos= await this.IngresosRepository.find();
            return existingIngresos.map(this.toDomain);
        } catch (error) {
            console.log("Error finding Ingresoss", error);
            throw new Error("Error encontrando Ingresoss");
        }
    }
    

}