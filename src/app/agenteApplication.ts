import { ticketAgente } from "../domain/agente.js";
import { ticketPort, modeloPort } from '../domain/agentePort.js';
import { graph, type Grafo } from "./Agent/grafo.js";

export class AgenteApplication{

    // puerto: auditoría de ticket realizada por el usuario
    private port: ticketPort;
    //Leer la estructura del grafo
    private grafo?: Grafo;

    constructor(port: ticketPort, modelo?:modeloPort){
        this.port=port;
        if (modelo) this.grafo = graph({modelo});
    }

    async createTicket(ticket: Omit<ticketAgente, "id">): Promise<number>{
        return this.port.createTicket(ticket);
    }

    async getTicketById(id:number): Promise<ticketAgente| null>{
        return await this.port.getTicketbyId(id);
    }

    async getAllTicket():Promise<ticketAgente[]>{
        return await this.port.getAllTicket();
    }

    async getTicketbyUser(idUser: number): Promise<ticketAgente[]>{
        return await this.port.getTicketbyUser(idUser);
    }

    async updateTicket(id:number, ticket:Partial<ticketAgente>): Promise<boolean>{
        const existingTicket = await this.port.getTicketbyId(id);
        
        if(!existingTicket){
            throw new Error("NO se puede actualizar el ticket, debido a que no está registrado");
        }

        return this.port.updateTicket(id, ticket);
    }

    async deleteTicket(id:number):Promise<boolean>{
        const existingTicket = await this.port.getTicketbyId(id);

        if(!existingTicket){
            throw new Error("No es posible borrar el ticket porque no existe");
        }

        return await this.port.deleteTicket(id);
    }
    
}