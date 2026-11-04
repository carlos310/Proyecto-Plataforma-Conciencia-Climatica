import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("costos")
export class Costos{
    @PrimaryGeneratedColumn()
    cos_id!:number;

    @Column({type:"character varying", length:45})
    cos_descripcion!:string; 
    @Column({type:"numeric"})
    cos_monto!:number; 
    @Column({type:"date"})
    cos_fecha!:Date;
    @Column({type:"character varying", length:45})
    cos_fuente!:string;
    @Column({type:"int"}) 
    emp_id!:number; 
    @Column({type:"int"})
    usu_id!:number;
    
}