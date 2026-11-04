import { IngresoApplication } from "../../app/ingresoApplication.js";
import { Request, Response } from "express";
import { loadUpdateIngresoData } from "../util/ingresos-update-validation.js";
import { Ingreso } from '../../domain/ingresos.js';
import { loadIngresoData } from "../util/ingresos-validation.js";

export class IngresoController{
    private app: IngresoApplication;
    constructor(application:IngresoApplication){
        this.app=application;
    }
    async createIngreso(req:Request, res:Response):Promise<Response>{
        try {
            //validar datos de entrada
            //se hce un reestructuración de los datos
            const{id, description, value, date, source, usuId}=loadIngresoData(req.body);
            //crear Ingreso
            const ingreso:Ingreso={id, description, value, date, source, usuId};
            const ingresoId= await this.app.createIngreso(ingreso);
            return res
            .status(201)
            .json({message:"Ingreso creado con exito", ingresoId})
        } catch (error) {
            if(error instanceof Error){
                return res
                .status(500)
                .json({
                    error:"error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({error:"error interno del servidor"});
        }
    }
    async updateIngreso(req:Request<{ id: string }>, res:Response):Promise<Response>{
        try {
            const id=Number(req.params.id);
            if(Number.isNaN(id)){
                return res.status(400).json({error:"ID invalido"})
            }//si no es un numero retorna true
            const dataLoad= loadUpdateIngresoData(req.body);
            const updated=await this.app.updateIngreso(id, dataLoad);
            if(!updated){
                return res.status(404).json({error:"Ingreso no encontrado o sin cambios"})
            }
            return res.status(200).json({
                message: "Ingreso actualizado con éxito"
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async getIngresoById(req:Request<{ id: string }>, res:Response):Promise<Response>{
        try {
            const id=Number(req.params.id);
            if(Number.isNaN(id)){
                return res.status(400).json({error:"ID invalido"})
            }//si no es un numero retorna true
            const ingreso=await this.app.getIngresoById(id);
            if(!ingreso){
                return res.status(404).json({error:"Ingreso no encontrado"})
            }
            return res.status(200).json(ingreso);
        } catch (error) {
             if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    
    async deleteIngreso(req:Request<{ id: string }>, res:Response):Promise<Response>{
        try {
            const id=Number(req.params.id);
            if(Number.isNaN(id)){
                return res.status(400).json({error:"ID invalido"})
            }   ;
            const ingreso=await this.app.deleteIngreso(id);
            if(!ingreso){
                return res.status(404).json({error:"Ingreso no encontrado"})
            }
            return res.status(200).json({message:"Ingreso eliminado con exito"});
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async getIngresoAllIngreso(req:Request, res:Response):Promise<Response>{
        try {
            const ingresos = await this.app.getAllIngresos();
            return res.status(200).json(ingresos);
        } catch (error) {
            return res.status(500).json({mensaje:"Error al traer los Ingresos", error});
        }

    }
}