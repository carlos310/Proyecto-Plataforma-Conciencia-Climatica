
import { Costo } from "../domain/costos.js";
import { CostoPort } from "../domain/costosPort.js";



export class CostoApplication{
    private port:CostoPort;
    constructor(port:CostoPort){
        this.port=port;
    };

    async createCostos(costo:Costo):Promise<number>{
        //el id lo asigna la base de datos, por eso no se revisa duplicados aquí
        return this.port.createCosto(costo);
    }
    
    async getCostoById(id:number):Promise<Costo|null>{
        return await this.port.getCostoById(id);
    }
    async getAllCostos():Promise<Costo[]>{
        return await this.port.getCostoAllCosto();
    };
    async updateCosto(id:number, costo:Partial<Costo>):Promise<boolean>{
        const existingCosto=await this.port.getCostoById(id);
        if(!existingCosto){
            throw new Error("No se puede actualizar porque el Costo no existe");
        }
        if(costo.id){
            const idTaken= await this.port.getCostoById(costo.id);
            if(idTaken&&idTaken.id!==id){
                throw new Error("el id ya está en uso");

            }
        }
        return this.port.updateCosto(id, costo);
    }
    async  deleteCosto(id:number):Promise<boolean>{
        const existCosto= await this.port.getCostoById(id);
        if(!existCosto){
            throw new Error("No es posible borrar el Costo porque no existe");
        }
        return await this.port.deleteCosto(id);
    };
}
