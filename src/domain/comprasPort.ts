import { Compra } from "./compras.js";

//definición de métodos
export interface CompraPort{
    createCompra(Compra:Omit<Compra, "id">):Promise<number>;
    updateCompra(id:number, Compra:Partial<Compra>):Promise<boolean>;
    deleteCompra(id:number):Promise<boolean>;
    getCompraById(id:number):Promise<Compra|null>;
    getCompraAllCompra():Promise<Compra[]>;
}