import { Request, Response } from "express";
import { AgenteApplication } from "../../app/agenteApplication.js";
import { ticketAgente } from "../../domain/agente.js";

type AuthenticatedRequest = Request & {
    user?: {
        id?: unknown;
        rol?: unknown;
    };
};

const estadosConsulta = ["activa", "inactiva", "error"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEstadoConsulta(value: unknown): value is ticketAgente["estadoConsulta"] {
    return typeof value === "string" && estadosConsulta.includes(value as ticketAgente["estadoConsulta"]);
}

export class AgenteController {
    constructor(private readonly app: AgenteApplication) {}

    private authenticatedUser(req: Request): { id: number; isAdmin: boolean } | null {
        const user = (req as AuthenticatedRequest).user;
        const id = Number(user?.id);
        if (!Number.isInteger(id) || id < 1) return null;
        return {
            id,
            isAdmin: String(user?.rol ?? "").trim().toLowerCase() === "admin",
        };
    }

    async createTicket(req: Request, res: Response): Promise<Response> {
        const user = this.authenticatedUser(req);
        if (!user) return res.status(401).json({ error: "Usuario no autenticado" });
        if (!isRecord(req.body)) return res.status(400).json({ error: "El cuerpo de la solicitud no es válido" });

        const { consulta, estadoConsulta, estadoTicket } = req.body;
        if (typeof consulta !== "string" || !consulta.trim()) {
            return res.status(400).json({ error: "La consulta es obligatoria" });
        }
        if (!isEstadoConsulta(estadoConsulta)) {
            return res.status(400).json({ error: "El estado de consulta no es válido" });
        }
        if (typeof estadoTicket !== "boolean") {
            return res.status(400).json({ error: "El estado del ticket debe ser booleano" });
        }

        try {
            const ticketId = await this.app.createTicket({
                usuarioID: user.id,
                consulta: consulta.trim(),
                estadoConsulta,
                estadoTicket,
                fechaCreacionTicket: new Date(),
            });
            return res.status(201).json({ message: "Ticket creado con éxito", ticketId });
        } catch (error) {
            return this.internalError(res, error);
        }
    }

    async getTicketById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        const user = this.authenticatedUser(req);
        if (!user) return res.status(401).json({ error: "Usuario no autenticado" });
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID inválido" });

        try {
            const ticket = await this.app.getTicketById(id);
            if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
            if (!user.isAdmin && ticket.usuarioID !== user.id) {
                return res.status(403).json({ error: "No tienes permiso para consultar este ticket" });
            }
            return res.status(200).json(ticket);
        } catch (error) {
            return this.internalError(res, error);
        }
    }

    async getTicketbyUser(req: Request<{ id: string }>, res: Response): Promise<Response> {
        const user = this.authenticatedUser(req);
        if (!user) return res.status(401).json({ error: "Usuario no autenticado" });
        const idUser = Number(req.params.id);
        if (!Number.isInteger(idUser) || idUser < 1) return res.status(400).json({ error: "ID de usuario inválido" });
        if (!user.isAdmin && idUser !== user.id) {
            return res.status(403).json({ error: "No tienes permiso para consultar estos tickets" });
        }

        try {
            return res.status(200).json(await this.app.getTicketbyUser(idUser));
        } catch (error) {
            return this.internalError(res, error);
        }
    }

    async getAllTicket(_req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json(await this.app.getAllTicket());
        } catch (error) {
            return this.internalError(res, error);
        }
    }

    async updateTicket(req: Request<{ id: string }>, res: Response): Promise<Response> {
        const user = this.authenticatedUser(req);
        if (!user) return res.status(401).json({ error: "Usuario no autenticado" });
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID inválido" });
        if (!isRecord(req.body)) return res.status(400).json({ error: "El cuerpo de la solicitud no es válido" });

        const allowedFields = ["consulta", "estadoConsulta", "estadoTicket"];
        if (Object.keys(req.body).length === 0 || Object.keys(req.body).some(key => !allowedFields.includes(key))) {
            return res.status(400).json({ error: "Los campos de actualización no son válidos" });
        }

        const update: Partial<ticketAgente> = {};
        if ("consulta" in req.body) {
            if (typeof req.body["consulta"] !== "string" || !req.body["consulta"].trim()) {
                return res.status(400).json({ error: "La consulta no puede estar vacía" });
            }
            update.consulta = req.body["consulta"].trim();
        }
        if ("estadoConsulta" in req.body) {
            if (!isEstadoConsulta(req.body["estadoConsulta"])) {
                return res.status(400).json({ error: "El estado de consulta no es válido" });
            }
            update.estadoConsulta = req.body["estadoConsulta"];
        }
        if ("estadoTicket" in req.body) {
            if (typeof req.body["estadoTicket"] !== "boolean") {
                return res.status(400).json({ error: "El estado del ticket debe ser booleano" });
            }
            update.estadoTicket = req.body["estadoTicket"];
        }

        try {
            const ticket = await this.app.getTicketById(id);
            if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
            if (!user.isAdmin && ticket.usuarioID !== user.id) {
                return res.status(403).json({ error: "No tienes permiso para modificar este ticket" });
            }
            await this.app.updateTicket(id, update);
            return res.status(200).json({ message: "Ticket actualizado con éxito" });
        } catch (error) {
            return this.internalError(res, error);
        }
    }

    async deleteTicket(req: Request<{ id: string }>, res: Response): Promise<Response> {
        const user = this.authenticatedUser(req);
        if (!user) return res.status(401).json({ error: "Usuario no autenticado" });
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID inválido" });

        try {
            const ticket = await this.app.getTicketById(id);
            if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
            if (!user.isAdmin && ticket.usuarioID !== user.id) {
                return res.status(403).json({ error: "No tienes permiso para eliminar este ticket" });
            }
            await this.app.deleteTicket(id);
            return res.status(200).json({ message: "Ticket eliminado con éxito" });
        } catch (error) {
            return this.internalError(res, error);
        }
    }

    private internalError(res: Response, error: unknown): Response {
        return res.status(500).json({
            error: "Error interno del servidor",
            details: error instanceof Error ? error.message : "Error desconocido",
        });
    }
}