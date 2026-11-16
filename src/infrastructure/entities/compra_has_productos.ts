import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("compra_has_productos")
export class CompraProductos{
    @PrimaryGeneratedColumn()
    chp_id!:number;

    @Column({type:"int"})
    cpr_id!:number;
    @Column({type:"int"})
    prod_id!:number;
    @Column({type:"int"})
    chp_cantidad!:number;
    @Column({type:"numeric", precision:10, scale:2})
    chp_precio_unitario!:number;
    @Column({type:"numeric", precision:10, scale:2})
    chp_subtotal!:number;
    @Column({type:"timestamp", default:() => "CURRENT_TIMESTAMP"})
    created_at!:Date;
}
