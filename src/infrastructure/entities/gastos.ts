import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity("gastos")
export class Gastos{
    @PrimaryGeneratedColumn()
    gas_id!:number;

    @Column({type:"character varying", length:45})
    gas_descripcion!:string; 
    @Column({type:"numeric"})
    gas_monto!:number;
    @Column({type:"date"})
    gas_fecha!:Date;
    @Column({type:"int"}) 
    emp_id!:number; 
    @Column({type:"int"})
    usu_id!:number;
   
}