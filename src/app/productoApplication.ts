
import { Producto } from "../domain/producto.js";
import { ProductoPort } from "../domain/productoPort.js";



export class ProductoApplication{
    private port:ProductoPort;
    constructor(port:ProductoPort){
        this.port=port;
    };

    async createProducto(producto:Producto):Promise<number>{
        //el id lo asigna la base de datos, por eso no se revisa duplicados aquí
        return this.port.createProducto(producto);
    }
    
    async getProductoById(id:number):Promise<Producto|null>{
        return await this.port.getProductoById(id);
    }
    async getAllProductos():Promise<Producto[]>{
        return await this.port.getProductoAllProducto();
    };
    async updateProducto(id:number, Producto:Partial<Producto>):Promise<boolean>{
        const existingProducto=await this.port.getProductoById(id);
        if(!existingProducto){
            throw new Error("No se puede actualizar porque el producto no existe");
        }
        if(Producto.id){
            const idTaken= await this.port.getProductoById(Producto.id);
            if(idTaken&&idTaken.id!==id){
                throw new Error("el id ya está en uso");

            }
        }
        return this.port.updateProducto(id, Producto);
    }
    async  deleteProducto(id:number):Promise<boolean>{
        const existProducto= await this.port.getProductoById(id);
        if(!existProducto){
            throw new Error("No es posible borrar el producto porque no existe");
        }
        return await this.port.deleteProducto(id);
    };
}
