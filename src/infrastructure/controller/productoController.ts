import { ProductoApplication } from "../../app/productoApplication.js";
import { Request, Response } from "express";
import { loadUpdateProductoData } from "../util/producto-update-validation.js";
import { Producto } from '../../domain/producto.js';
import { loadProductoData } from "../util/producto-validation.js";

export class ProductoController{
    private app: ProductoApplication;
    constructor(application:ProductoApplication){
        this.app=application;
    }
    async createProducto(req:Request, res:Response):Promise<Response>{
        try {
            //validar datos de entrada
            //se hce un reestructuración de los datos
            const{id,name,description,sellValue,buyValue,stock,category,providerId}=loadProductoData(req.body);
            //crear Producto
            const producto:Producto={id,name,description,sellValue,buyValue,stock,category,providerId};
            const productoId= await this.app.createProducto(producto);
            return res
            .status(201)
            .json({message:"Producto creado con exito", productoId})
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
    async updateProducto(req:Request<{ id: string }>, res:Response):Promise<Response>{
        try {
            const id=Number(req.params.id);
            if(Number.isNaN(id)){
                return res.status(400).json({error:"ID invalido"})
            }//si no es un numero retorna true
            const dataLoad= loadUpdateProductoData(req.body);
            const updated=await this.app.updateProducto(id, dataLoad);
            if(!updated){
                return res.status(404).json({error:"Producto no encontrado o sin cambios"})
            }
            return res.status(200).json({
                message: "Producto actualizado con éxito"
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
    async getProductoById(req:Request<{ id: string }>, res:Response):Promise<Response>{
        try {
            const id=Number(req.params.id);
            if(Number.isNaN(id)){
                return res.status(400).json({error:"ID invalido"})
            }//si no es un numero retorna true
            const producto=await this.app.getProductoById(id);
            if(!producto){
                return res.status(404).json({error:"Producto no encontrado"})
            }
            return res.status(200).json(producto);
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
    
    async deleteProducto(req:Request<{ id: string }>, res:Response):Promise<Response>{
        try {
            const id=Number(req.params.id);
            if(Number.isNaN(id)){
                return res.status(400).json({error:"ID invalido"})
            }   ;
            const producto=await this.app.deleteProducto(id);
            if(!producto){
                return res.status(404).json({error:"Producto no encontrado"})
            }
            return res.status(200).json({message:"Producto eliminado con exito"});
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
    async getProductoAllProducto(req:Request, res:Response):Promise<Response>{
        try {
            const Productos = await this.app.getAllProductos();
            return res.status(200).json(Productos);
        } catch (error) {
            return res.status(500).json({mensaje:"Error al traer los Productos", error});
        }

    }
}