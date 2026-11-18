import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("facturas")
export class Factura {
    @PrimaryGeneratedColumn()
    fac_id!: number;

    @Column({ type: "character varying", length: 50 })
    fac_tipo!: string;

    @Column({ type: "int" })
    fac_referencia_id!: number;

    @Column({ type: "date" })
    fac_fecha!: Date;

    @Column({ type: "numeric" })
    fac_total!: number;

    @Column({ type: "int" })
    fac_cantidad!: number;

    @Column({ type: "character varying", length: 50 })
    fac_estado!: string;

    @Column({ type: "character varying", length: 100 })
    fac_proveedor_cliente!: string;

    @Column({ type: "int" })
    usu_id!: number;

    @Column({ type: "character varying", length: 100, nullable: true })
    fac_lote_id!: string;
}
