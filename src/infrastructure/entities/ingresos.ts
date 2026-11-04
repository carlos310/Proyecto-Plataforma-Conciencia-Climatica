import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("ingresos")
export class Ingresos{
    @PrimaryGeneratedColumn()
    ing_id!:number;

    @Column({type:"character varying", length:45})
    ing_descripcion!:string; 
    @Column({type:"numeric"})
    ing_monto!:number; 
    @Column({type:"date"})
    ing_fecha!:Date;
    @Column({type:"character varying", length:45})
    ing_fuente!:string;
    @Column({type:"int"}) 
    usu_id!:number; 
}