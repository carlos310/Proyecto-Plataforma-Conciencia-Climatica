import { VentaApplication } from "../../app/ventaApplication.js";
import { Request, Response } from "express";
import { loadUpdateVentaData } from "../util/venta-update-validation.js";
import { Venta } from '../../domain/venta.js';
import { loadVentaData } from "../util/venta-validation.js";

export class VentaController {
    private app: VentaApplication;

    constructor(application: VentaApplication) {
        this.app = application;
    }

    async createVenta(req: Request, res: Response): Promise<Response> {
        try {
            const { id, total, cantidad, fecha, clienteId, usuId } = loadVentaData(req.body);
            const venta: Venta = { id, total, cantidad, fecha, clienteId, usuId };
            const ventaId = await this.app.createVenta(venta);
            return res.status(201).json({ message: "Venta creada con éxito", ventaId });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateVenta(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const dataLoad = loadUpdateVentaData(req.body);
            const updated = await this.app.updateVenta(id, dataLoad);
            if (!updated) {
                return res.status(404).json({ error: "Venta no encontrada o sin cambios" });
            }
            return res.status(200).json({ message: "Venta actualizada con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getVentaById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const venta = await this.app.getVentaById(id);
            if (!venta) {
                return res.status(404).json({ error: "Venta no encontrada" });
            }
            return res.status(200).json(venta);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteVenta(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const venta = await this.app.deleteVenta(id);
            if (!venta) {
                return res.status(404).json({ error: "Venta no encontrada" });
            }
            return res.status(200).json({ message: "Venta eliminada con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getVentaAllVenta(req: Request, res: Response): Promise<Response> {
        try {
            const Ventas = await this.app.getAllVentas();
            return res.status(200).json(Ventas);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al traer las Ventas", error });
        }
    }
}
