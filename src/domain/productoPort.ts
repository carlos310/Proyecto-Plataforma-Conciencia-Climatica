import { Producto } from "./producto.js";

//definición de métodos
export interface ProductoPort{
    createProducto(producto:Omit<Producto, "id">):Promise<number>;
    updateProducto(id:number, Producto:Partial<Producto>):Promise<boolean>;
    deleteProducto(id:number):Promise<boolean>;
    getProductoById(id:number):Promise<Producto|null>;
    getProductoAllProducto():Promise<Producto[]>;
}