import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ticketAgente")
export class ticketAgente{

    @PrimaryGeneratedColumn()
    ticket_id!: number;

    @Column({type: "numeric"})
    ticket_usuarioID!:number;
    @Column({type: "character varying"})
    ticket_consulta!: string;
    @Column({type: "character varying"})
    ticket_estadoConsulta!: "activa" | "inactiva" | "error";
    @Column({type: "boolean"})
    ticket_estadoTicket!: boolean;
    @Column({type: "timestamp"})
    ticket_timestamp!: Date;
}