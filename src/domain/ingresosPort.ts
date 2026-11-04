import { Ingreso } from "./ingresos.js";

//definición de métodos
export interface IngresoPort{
    createIngreso(Ingreso:Omit<Ingreso, "id">):Promise<number>;
    updateIngreso(id:number, Ingreso:Partial<Ingreso>):Promise<boolean>;
    deleteIngreso(id:number):Promise<boolean>;
    getIngresoById(id:number):Promise<Ingreso|null>;
    getIngresoAllIngreso():Promise<Ingreso[]>;
}