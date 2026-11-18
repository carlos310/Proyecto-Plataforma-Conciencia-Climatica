import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ventas")
export class Venta {
    @PrimaryGeneratedColumn()
    ven_id!: number;

    @Column({ type: "numeric" })
    ven_total!: number;

    @Column({ type: "int" })
    ven_cantidad!: number;

    @Column({ type: "date" })
    ven_fecha!: Date;

    @Column({ type: "int" })
    cli_id!: number;

    @Column({ type: "int" })
    usu_id!: number;
}
