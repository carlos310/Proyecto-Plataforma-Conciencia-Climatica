import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("compras")
export class Compras{
    @PrimaryGeneratedColumn()
    cpr_id!:number;

    @Column({type:"numeric"})
    cpr_total!:number;
    @Column({type:"int"})
    cpr_cantidad!:number;
    @Column({type:"date"})
    cpr_fecha!:Date;
    @Column({type:"int"})
    prov_id!:number;
    @Column({type:"int"})
    usu_id!:number;


}