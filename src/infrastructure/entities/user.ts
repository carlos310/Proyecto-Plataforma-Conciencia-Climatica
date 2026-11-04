import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("usuarios")
export class User{
    @PrimaryGeneratedColumn()
    usu_id!:number;

    @Column({type:"character varying", length:45})
    usu_nombre!:string; 
    @Column({type:"text", unique:true})
    usu_email !:string;
    @Column({type:"character varying", length:45, nullable: true })
    usu_contrasena!:string;
    @Column({type:"character varying", length:100}) 
    usu_rol!:string; 
    
}