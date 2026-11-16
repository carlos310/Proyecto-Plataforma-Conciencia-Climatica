import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("productos_has_ventas")
export class ProductosHasVentas{
    @PrimaryGeneratedColumn()
    phv_id!:number;

    @Column({type:"int"})
    ven_id!:number;
    @Column({type:"int"})
    prod_id!:number;
    @Column({type:"int", nullable:true})
    phv_cantidad!:number;
    @Column({type:"numeric", precision:10, scale:2, nullable:true})
    phv_precio_unitario!:number;
    @Column({type:"numeric", precision:10, scale:2, nullable:true})
    phv_subtotal!:number;
    @Column({type:"timestamp", default:() => "CURRENT_TIMESTAMP"})
    created_at!:Date;
}
