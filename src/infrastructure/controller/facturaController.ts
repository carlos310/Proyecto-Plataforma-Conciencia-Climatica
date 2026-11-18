import { FacturaApplication } from "../../app/facturaApplication.js";
import { Request, Response } from "express";
import { loadUpdateFacturaData } from "../util/factura-update-validation.js";
import { Factura } from '../../domain/factura.js';
import { loadFacturaData } from "../util/factura-validation.js";

export class FacturaController {
    private app: FacturaApplication;

    constructor(application: FacturaApplication) {
        this.app = application;
    }

    async createFactura(req: Request, res: Response): Promise<Response> {
        try {
            const { id, tipo, referenciaId, fecha, total, cantidad, estado, proveedorCliente, usuId, loteId } = loadFacturaData(req.body);
            const factura: Factura = { id, tipo, referenciaId, fecha, total, cantidad, estado, proveedorCliente, usuId, loteId };
            const facturaId = await this.app.createFactura(factura);
            return res.status(201).json({ message: "Factura creada con éxito", facturaId });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateFactura(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const dataLoad = loadUpdateFacturaData(req.body);
            const updated = await this.app.updateFactura(id, dataLoad);
            if (!updated) {
                return res.status(404).json({ error: "Factura no encontrada o sin cambios" });
            }
            return res.status(200).json({ message: "Factura actualizada con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getFacturaById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const factura = await this.app.getFacturaById(id);
            if (!factura) {
                return res.status(404).json({ error: "Factura no encontrada" });
            }
            return res.status(200).json(factura);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteFactura(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const factura = await this.app.deleteFactura(id);
            if (!factura) {
                return res.status(404).json({ error: "Factura no encontrada" });
            }
            return res.status(200).json({ message: "Factura eliminada con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getFacturaAllFactura(req: Request, res: Response): Promise<Response> {
        try {
            const Facturas = await this.app.getAllFacturas();
            return res.status(200).json(Facturas);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al traer las Facturas", error });
        }
    }
}
