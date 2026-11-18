import { ClienteApplication } from "../../app/clienteApplication.js";
import { Request, Response } from "express";
import { loadUpdateClienteData } from "../util/cliente-update-validation.js";
import { Cliente } from '../../domain/cliente.js';
import { loadClienteData } from "../util/cliente-validation.js";

export class ClienteController {
    private app: ClienteApplication;

    constructor(application: ClienteApplication) {
        this.app = application;
    }

    async createCliente(req: Request, res: Response): Promise<Response> {
        try {
            const { id, nombre, apellido, email, telefono, direccion, usuId, rol } = loadClienteData(req.body);
            const cliente: Cliente = { id, nombre, apellido, email, telefono, direccion, usuId, rol };
            const clienteId = await this.app.createCliente(cliente);
            return res
                .status(201)
                .json({ message: "Cliente creado con éxito", clienteId });
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(500)
                    .json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateCliente(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const dataLoad = loadUpdateClienteData(req.body);
            const updated = await this.app.updateCliente(id, dataLoad);
            if (!updated) {
                return res.status(404).json({ error: "Cliente no encontrado o sin cambios" });
            }
            return res.status(200).json({
                message: "Cliente actualizado con éxito"
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getClienteById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const cliente = await this.app.getClienteById(id);
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            return res.status(200).json(cliente);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteCliente(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const cliente = await this.app.deleteCliente(id);
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            return res.status(200).json({ message: "Cliente eliminado con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getClienteAllCliente(req: Request, res: Response): Promise<Response> {
        try {
            const Clientes = await this.app.getAllClientes();
            return res.status(200).json(Clientes);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al traer los Clientes", error });
        }
    }
}
