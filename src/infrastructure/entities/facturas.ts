import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("facturas")
export class Facturas{
    @PrimaryGeneratedColumn()
    fac_id!:number;

    @Column({type:"character varying", length:45})
    fac_tipo!:string;
    @Column({type:"int"})
    fac_referencia_id!:number;
    @Column({type:"date"})
    fac_fecha!:Date;
    @Column({type:"numeric", precision:10, scale:2})
    fac_total!:number;
    @Column({type:"int"})
    fac_cantidad!:number;
    @Column({type:"character varying", length:45, nullable:true})
    fac_estado!:string;
    @Column({type:"character varying", length:100, nullable:true})
    fac_proveedor_cliente!:string;
    @Column({type:"int"})
    usu_id!:number;
    @Column({type:"int", nullable:true})
    fac_lote_id!:number;
    @Column({type:"timestamp", default:() => "CURRENT_TIMESTAMP"})
    created_at!:Date;
}
