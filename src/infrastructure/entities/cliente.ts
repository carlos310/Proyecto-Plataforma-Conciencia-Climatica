import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("clientes")
export class Cliente {
    @PrimaryGeneratedColumn()
    cli_id!: number;

    @Column({ type: "character varying", length: 100 })
    cli_nombre!: string;

    @Column({ type: "character varying", length: 100 })
    cli_apellido!: string;

    @Column({ type: "character varying", length: 100, unique: true })
    cli_email!: string;

    @Column({ type: "character varying", length: 20 })
    cli_telefono!: string;

    @Column({ type: "character varying", length: 150 })
    cli_direccion!: string;

    @Column({ type: "int" })
    usu_id!: number;

    @Column({ type: "character varying", length: 50 })
    cli_rol!: string;
}
