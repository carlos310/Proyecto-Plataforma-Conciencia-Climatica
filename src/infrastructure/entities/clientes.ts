import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("clientes")
export class Clientes{
    @PrimaryGeneratedColumn()
    cli_id!:number;

    @Column({type:"character varying", length:70, nullable:true})
    cli_nombre!:string;
    @Column({type:"character varying", length:70, nullable:true})
    cli_apellido!:string;
    @Column({type:"text", unique:true})
    cli_email!:string;
    @Column({type:"character varying", length:10, unique:true})
    cli_telefono!:string;
    @Column({type:"character varying", length:100, nullable:true})
    cli_direccion!:string;
    @Column({type:"int"})
    usu_id!:number;
    @Column({type:"character varying", length:45, nullable:true})
    cli_rol!:string;
}
