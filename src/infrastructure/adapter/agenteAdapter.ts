import { Repository } from "typeorm";
import { ticketAgente as TicketDomain } from "../../domain/agente.js";
import { ticketPort } from "../../domain/agentePort.js";
import { ticketAgente as TicketEntity } from "../entities/agente.js";
import { AppDataSource } from "../config/data-base.js";

export class TicketAdapter implements ticketPort {
    private ticketRepository: Repository<TicketEntity>;

    constructor() {
        this.ticketRepository = AppDataSource.getRepository(TicketEntity);
    }

    private toDomain(ticket: TicketEntity): TicketDomain {
        return {
            id: ticket.ticket_id,
            usuarioID: ticket.ticket_usuarioID,
            consulta: ticket.ticket_consulta,
            estadoConsulta: ticket.ticket_estadoConsulta,
            estadoTicket: ticket.ticket_estadoTicket,
            fechaCreacionTicket: ticket.ticket_timestamp,
        };
    }

    private toEntity(ticket: Omit<TicketDomain, "id">): TicketEntity {
        const entity = new TicketEntity();
        entity.ticket_usuarioID = ticket.usuarioID;
        entity.ticket_consulta = ticket.consulta;
        entity.ticket_estadoConsulta = ticket.estadoConsulta;
        entity.ticket_estadoTicket = ticket.estadoTicket;
        entity.ticket_timestamp = ticket.fechaCreacionTicket;
        return entity;
    }

    async createTicket(ticket: Omit<TicketDomain, "id">): Promise<number> {
        try {
            const savedTicket = await this.ticketRepository.save(this.toEntity(ticket));
            return savedTicket.ticket_id;
        } catch (error) {
            console.error("Error creating ticket", error);
            throw new Error("Error creando el ticket");
        }
    }

    async updateTicket(id: number, ticket: Partial<TicketDomain>): Promise<boolean> {
        try {
            const existingTicket = await this.ticketRepository.findOne({ where: { ticket_id: id } });
            if (!existingTicket) return false;

            Object.assign(existingTicket, {
                ticket_usuarioID: ticket.usuarioID ?? existingTicket.ticket_usuarioID,
                ticket_consulta: ticket.consulta ?? existingTicket.ticket_consulta,
                ticket_estadoConsulta: ticket.estadoConsulta ?? existingTicket.ticket_estadoConsulta,
                ticket_estadoTicket: ticket.estadoTicket ?? existingTicket.ticket_estadoTicket,
                ticket_timestamp: ticket.fechaCreacionTicket ?? existingTicket.ticket_timestamp,
            });
            await this.ticketRepository.save(existingTicket);
            return true;
        } catch (error) {
            console.error("Error updating ticket", error);
            throw new Error("Error actualizando el ticket");
        }
    }

    async deleteTicket(id: number): Promise<boolean> {
        try {
            const result = await this.ticketRepository.delete({ ticket_id: id });
            return (result.affected ?? 0) > 0;
        } catch (error) {
            console.error("Error deleting ticket", error);
            throw new Error("Error eliminando el ticket");
        }
    }

    async getTicketbyId(id: number): Promise<TicketDomain | null> {
        try {
            const ticket = await this.ticketRepository.findOne({ where: { ticket_id: id } });
            return ticket ? this.toDomain(ticket) : null;
        } catch (error) {
            console.error("Error finding ticket", error);
            throw new Error("Error encontrando el ticket");
        }
    }

    async getTicketbyUser(idUser: number): Promise<TicketDomain[]> {
        try {
            const tickets = await this.ticketRepository.find({ where: { ticket_usuarioID: idUser } });
            return tickets.map(ticket => this.toDomain(ticket));
        } catch (error) {
            console.error("Error finding user tickets", error);
            throw new Error("Error encontrando los tickets del usuario");
        }
    }

    async getAllTicket(): Promise<TicketDomain[]> {
        try {
            const tickets = await this.ticketRepository.find();
            return tickets.map(ticket => this.toDomain(ticket));
        } catch (error) {
            console.error("Error finding tickets", error);
            throw new Error("Error encontrando tickets");
        }
    }
}
