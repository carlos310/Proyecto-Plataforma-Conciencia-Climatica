import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("proveedores")
export class Proveedor{
    @PrimaryGeneratedColumn()
    prov_id!:number;

    @Column({type:"character varying", length:100, unique:true})
    prov_nombre!:string;
    @Column({type:"text", nullable:true})
    prov_email!:string;
    @Column({type:"character varying", length:10, nullable:true})
    prov_telefono!:string;
    @Column({type:"character varying", length:100, nullable:true})
    prov_direccion!:string;
    @Column({type:"character varying", length:45, nullable:true})
    prov_ciudad!:string;
    @Column({type:"character varying", length:45, nullable:true})
    prov_pais!:string;
    @Column({type:"character varying", length:70, nullable:true})
    prov_contacto!:string;
    @Column({type:"character varying", length:20, default:"ACTIVO"})
    prov_estado!:string;
    @Column({type:"timestamp", default:() => "CURRENT_TIMESTAMP"})
    created_at!:Date;
    @Column({type:"timestamp", default:() => "CURRENT_TIMESTAMP"})
    updated_at!:Date;
}
