import { ProveedorApplication } from "../../app/proveedorApplication.js";
import { Request, Response } from "express";
import { loadUpdateProveedorData } from "../util/proveedor-update-validation.js";
import { Proveedor } from '../../domain/proveedor.js';
import { loadProveedorData } from "../util/proveedor-validation.js";

export class ProveedorController {
    private app: ProveedorApplication;

    constructor(application: ProveedorApplication) {
        this.app = application;
    }

    async createProveedor(req: Request, res: Response): Promise<Response> {
        try {
            const { id, nombre, email, telefono, direccion, ciudad, pais, contacto, estado } = loadProveedorData(req.body);
            const proveedor: Proveedor = { id, nombre, email, telefono, direccion, ciudad, pais, contacto, estado };
            const proveedorId = await this.app.createProveedor(proveedor);
            return res
                .status(201)
                .json({ message: "Proveedor creado con éxito", proveedorId });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.startsWith("DUPLICATE_EMAIL:")) {
                    return res.status(409).json({
                        error: "Conflicto",
                        details: "Ya existe un proveedor registrado con ese correo electrónico",
                    });
                }
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

    async updateProveedor(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const dataLoad = loadUpdateProveedorData(req.body);
            const updated = await this.app.updateProveedor(id, dataLoad);
            if (!updated) {
                return res.status(404).json({ error: "Proveedor no encontrado o sin cambios" });
            }
            return res.status(200).json({
                message: "Proveedor actualizado con éxito"
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

    async getProveedorById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const proveedor = await this.app.getProveedorById(id);
            if (!proveedor) {
                return res.status(404).json({ error: "Proveedor no encontrado" });
            }
            return res.status(200).json(proveedor);
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

    async deleteProveedor(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const proveedor = await this.app.deleteProveedor(id);
            if (!proveedor) {
                return res.status(404).json({ error: "Proveedor no encontrado" });
            }
            return res.status(200).json({ message: "Proveedor eliminado con éxito" });
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

    async getProveedorAllProveedor(req: Request, res: Response): Promise<Response> {
        try {
            const Proveedores = await this.app.getAllProveedores();
            return res.status(200).json(Proveedores);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al traer los Proveedores", error });
        }
    }
}
