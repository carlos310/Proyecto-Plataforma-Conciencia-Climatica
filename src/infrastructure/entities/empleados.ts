import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("empleados")
export class Empleados{
    @PrimaryGeneratedColumn()
    emp_id!:number;

    @Column({type:"character varying", length:70, nullable:true})
    emp_nombre!:string;
    @Column({type:"character varying", length:70, nullable:true})
    emp_apellido!:string;
    @Column({type:"character varying", length:45, nullable:true})
    emp_cargo!:string;
    @Column({type:"numeric", precision:10, scale:2, nullable:true})
    emp_salario!:number;
    @Column({type:"date", nullable:true})
    emp_fecha_contratacion!:Date;
    @Column({type:"int"})
    usu_id!:number;
    @Column({type:"character varying", length:45, nullable:true})
    emp_rol!:string;
}
