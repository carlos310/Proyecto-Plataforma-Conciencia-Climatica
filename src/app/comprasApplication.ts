
import { Compra } from "../domain/compras.js";
import { CompraPort } from "../domain/comprasPort.js";



export class CompraApplication{
    private port:CompraPort;
    constructor(port:CompraPort){
        this.port=port;
    };

    async createCompras(compra:Compra):Promise<number>{
        //el id lo asigna la base de datos, por eso no se revisa duplicados aquí
        return this.port.createCompra(compra);
    }
    
    async getCompraById(id:number):Promise<Compra|null>{
        return await this.port.getCompraById(id);
    }
    async getAllCompras():Promise<Compra[]>{
        return await this.port.getCompraAllCompra();
    };
    async updateCompra(id:number, compra:Partial<Compra>):Promise<boolean>{
        const existingCompra=await this.port.getCompraById(id);
        if(!existingCompra){
            throw new Error("No se puede actualizar porque el Compra no existe");
        }
        if(compra.id){
            const idTaken= await this.port.getCompraById(compra.id);
            if(idTaken&&idTaken.id!==id){
                throw new Error("el id ya está en uso");

            }
        }
        return this.port.updateCompra(id, compra);
    }
    async  deleteCompra(id:number):Promise<boolean>{
        const existCompra= await this.port.getCompraById(id);
        if(!existCompra){
            throw new Error("No es posible borrar el Compra porque no existe");
        }
        return await this.port.deleteCompra(id);
    };
}
