import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("productos")
export class Producto{
    @PrimaryGeneratedColumn()
    prod_id!:number;

    @Column({type:"character varying", length:45})
    prod_nombre!:string; 
    @Column({type:"character varying", length:45})
    prod_descripcion!:string; 
    @Column({type:"numeric"})
    prod_precio_venta!:number;
    @Column({type:"numeric"})
    prod_precio_compra!:number;
    @Column({type:"character varying", length:40}) 
    prod_stock!:number; 
    @Column({type:"character varying", length:45})
    prod_categoria!:string;
    @Column({type:"character varying", length:45})
    fk_prov_id!:string;
     
}