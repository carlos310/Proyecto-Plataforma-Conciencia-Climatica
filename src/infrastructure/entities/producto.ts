import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("productos")
export class Producto{
    @PrimaryGeneratedColumn()
    prod_id!:number;

    @Column({type:"numeric"})
    prod_referencia!:number;
    @Column({type:"character varying", length:45})
    prod_nombre!:string; 
    @Column({type:"character varying", length:45})
    prod_descripcion!:string; 
    @Column({type:"numeric"})
    prod_precio_venta!:number;
    @Column({type:"numeric"})
    prod_precio_compra!:number;
    @Column({type:"character varying", length:45})
    prod_stock!:string;
    @Column({type:"character varying", length:45})
    prod_categoria!:string;
    @Column({type:"character varying", length:45})
    prod_medida!:string;
    @Column({type:"character varying", length:45})
    prod_material!:string;
    @Column({type:"int"})
    prov_id!:number;
    
}