import { Gasto } from "./gastos.js";

//definición de métodos
export interface GastoPort{
    createGasto(Gasto:Omit<Gasto, "id">):Promise<number>;
    updateGasto(id:number, Gasto:Partial<Gasto>):Promise<boolean>;
    deleteGasto(id:number):Promise<boolean>;
    getGastoById(id:number):Promise<Gasto|null>;
    getGastoAllGasto():Promise<Gasto[]>;
}