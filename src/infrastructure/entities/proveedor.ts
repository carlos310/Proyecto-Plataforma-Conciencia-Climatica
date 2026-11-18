import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("proveedores")
export class Proveedor {
    @PrimaryGeneratedColumn()
    prov_id!: number;

    @Column({ type: "character varying", length: 100 })
    prov_nombre!: string;

    @Column({ type: "character varying", length: 100, unique: true })
    prov_email!: string;

    @Column({ type: "character varying", length: 20 })
    prov_telefono!: string;

    @Column({ type: "character varying", length: 150 })
    prov_direccion!: string;

    @Column({ type: "character varying", length: 50 })
    prov_ciudad!: string;

    @Column({ type: "character varying", length: 50 })
    prov_pais!: string;

    @Column({ type: "character varying", length: 100 })
    prov_contacto!: string;

    @Column({ type: "character varying", length: 20, default: "activo" })
    prov_estado!: string;
}
