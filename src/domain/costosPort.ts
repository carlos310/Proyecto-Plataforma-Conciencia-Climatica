import { Costo } from "./costos.js";

//definición de métodos
export interface CostoPort{
    createCosto(Costo:Omit<Costo, "id">):Promise<number>;
    updateCosto(id:number, Costo:Partial<Costo>):Promise<boolean>;
    deleteCosto(id:number):Promise<boolean>;
    getCostoById(id:number):Promise<Costo|null>;
    getCostoAllCosto():Promise<Costo[]>;
}