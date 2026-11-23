import { ticketAgente } from "./agente";

export interface ticketPort {
  createTicket(ticket: Omit<ticketAgente, "id">): Promise<number>;
  updateTicket(id:number, ticket:Partial<ticketAgente>): Promise<boolean>;
  deleteTicket(id:number):Promise<boolean>;
  getTicketbyId(id: number): Promise<ticketAgente | null>;
  getTicketbyUser(idUser: number): Promise<ticketAgente[]>;
  getAllTicket():Promise<ticketAgente[]>;
}

export interface modeloPort{
    generarJson(prompt:string): Promise<unknown>;
}