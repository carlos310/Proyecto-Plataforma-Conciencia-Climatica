import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("empleados")
export class Empleado {
    @PrimaryGeneratedColumn()
    emp_id!: number;

    @Column({ type: "character varying", length: 100 })
    emp_nombre!: string;

    @Column({ type: "character varying", length: 100 })
    emp_apellido!: string;

    @Column({ type: "character varying", length: 100 })
    emp_cargo!: string;

    @Column({ type: "numeric" })
    emp_salario!: number;

    @Column({ type: "date" })
    emp_fecha_contratacion!: Date;

    @Column({ type: "int" })
    usu_id!: number;

    @Column({ type: "character varying", length: 50 })
    emp_rol!: string;
}
