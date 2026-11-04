import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("compra_productos")
export class Compras{
    @PrimaryGeneratedColumn()
    cpr_id!:number;

    @Column({type:"numeric"})
    cpr_total!:number; 
    @Column({type:"int"})
    cpr_cantidad!:number; 
    @Column({type:"date"})
    cpr_fecha!:Date;
    @Column({type:"character varying", length:45})
    cpr_proveedor!:string;
    @Column({type:"int"}) 
    usu_id!:number; 
    
    
}