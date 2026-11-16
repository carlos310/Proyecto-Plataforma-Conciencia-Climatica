import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("ventas")
export class Ventas{
    @PrimaryGeneratedColumn()
    ven_id!:number;

    @Column({type:"numeric", precision:10, scale:2})
    ven_total!:number;
    @Column({type:"int", nullable:true})
    ven_cantidad!:number;
    @Column({type:"date", nullable:true})
    ven_fecha!:Date;
    @Column({type:"int", nullable:true})
    cli_id!:number;
    @Column({type:"int", nullable:true})
    usu_id!:number;
}
