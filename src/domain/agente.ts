export interface ticketAgente {

    id: number;
    usuarioID: number;
    consulta:string;
    estadoConsulta: "activa" | "inactiva" | "error";
    estadoTicket: boolean;
    fechaCreacionTicket: Date;
}
