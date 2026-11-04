import { Repository } from 'typeorm';
import { Producto as ProductoDomain } from '../../domain/producto.js';
import {Producto as ProductoEntity} from '../entities/producto.js';
import { ProductoPort } from '../../domain/productoPort.js';
import { AppDataSource } from '../config/data-base.js';
//esta capa de adaptadores siempre requieren de implementar los puertos
//esta capa de adaptaadores son los encargados de hacer el cambio de informacion directamente con la base de datos  atravezz del typeorm
export class ProductoAdapter implements ProductoPort{
    private ProductoRepository:Repository<ProductoEntity>;// se usa repository ppara indicar dentro de el la clase con la que se va a hacer el intercambio, el repository hace el crud de la entidad que contiene
    constructor(){
        this.ProductoRepository=AppDataSource.getRepository(ProductoEntity);//se usa la entidad definida puesto que esta trae los datos de la base de datos
    }
    //se usa tanto el domain como el entity con el fin de transformar su información y generar una comunicación entre ellos con el fin de poder passar información de un lado a otro
    private toDomain(Producto:ProductoEntity):ProductoDomain{
        //se especifican los nombres de los datos primero de ProductoDomain : y ProductoEntity para hacer la igualación
        return{
            id:Producto.prod_id,
            name:Producto.prod_nombre,
            description:Producto.prod_descripcion,
            sellValue:Producto.prod_precio_venta,
            buyValue:Producto.prod_precio_compra,
            stock:Producto.prod_stock,
            category:Producto.prod_categoria,
            providerId:Number(Producto.fk_prov_id),
        }
    }
    //se pasan los datos del dominio a modelo entidad
    private toEntity(Producto:Omit<ProductoDomain, "id">):ProductoEntity{
        const productoEntity= new ProductoEntity();
        productoEntity.prod_nombre= Producto.name;
        productoEntity.prod_descripcion= Producto.description;
        productoEntity.prod_precio_venta= Producto.sellValue;
        productoEntity.prod_precio_compra= Producto.buyValue;
        productoEntity.prod_stock= Producto.stock;
        productoEntity.prod_categoria= Producto.category;
        productoEntity.fk_prov_id=String(Producto.providerId);
        return productoEntity;
    }

    //se importan todas las funciones dentro de port puesto que en este caso se hace un contrato y el contrato 
    //acá se usa Productodomain puesto que es el que determina la interfaz de contrato que se va a usar
    async createProducto(Producto: Omit<ProductoDomain, 'id'>): Promise<number> {
        try {
            const newProducto= this.toEntity(Producto);
            const savedProducto=await this.ProductoRepository.save(newProducto);
            return savedProducto.prod_id;
        } catch (error) {
            console.log("Error creating the new Producto", error);
            throw new Error("Error creando el producto");
        }
    }
    async updateProducto(id: number, Producto: Partial<ProductoDomain>): Promise<boolean> {
        try {
            const existingProducto=await this.ProductoRepository.findOne({where : {prod_id:id}});
            if(!existingProducto) return false;
            Object.assign(existingProducto, {
                prod_nombre:Producto.name ?? existingProducto.prod_nombre,
                prod_descripcion:Producto.description ?? existingProducto.prod_descripcion,
                prod_precio_venta:Producto.sellValue??existingProducto.prod_precio_venta,
                prod_precio_compra:Producto.buyValue ?? existingProducto.prod_precio_compra,
                prod_stock: Producto.stock ?? existingProducto.prod_stock,
                prod_categoria: Producto.category ?? existingProducto.prod_categoria,
                fk_prov_id:Producto.providerId?? existingProducto.fk_prov_id,
            });
            await this.ProductoRepository.save(existingProducto);
            return true;
            
        } catch (error) {
            console.log("Error updating the new Producto", error);
            throw new Error("Error actualizando el producto");
        }
    }
    async deleteProducto(id: number): Promise<boolean> {
        try {
            const existingProducto= await this.ProductoRepository.findOne({where : {prod_id:id}});
            if(!existingProducto) return false;
            await this.ProductoRepository.delete({ prod_id: id });
            return true;
        } catch (error) {
            console.log("Error creating the new Producto", error);
            throw new Error("Error creando el producto");
        }
    }
    async getProductoById(id: number): Promise<ProductoDomain | null> {
        try {
            const existingProducto= await this.ProductoRepository.findOne({where : {prod_id:id}});
            return existingProducto? this.toDomain(existingProducto):null;
        } catch (error) {
            console.log("Error finding the new Producto", error);
            throw new Error("Error encontrando el producto");
        }
    }
    
    async getProductoAllProducto(): Promise<ProductoDomain[]> {
        try {
            const existingProducto= await this.ProductoRepository.find();
            return existingProducto.map(this.toDomain);
        } catch (error) {
            console.log("Error finding Productos", error);
            throw new Error("Error encontrando productos");
        }
    }
    

}