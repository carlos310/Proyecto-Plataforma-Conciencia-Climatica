import { EmpleadoApplication } from "../../app/empleadoApplication.js";
import { Request, Response } from "express";
import { loadUpdateEmpleadoData } from "../util/empleado-update-validation.js";
import { Empleado } from '../../domain/empleado.js';
import { loadEmpleadoData } from "../util/empleado-validation.js";

export class EmpleadoController {
    private app: EmpleadoApplication;

    constructor(application: EmpleadoApplication) {
        this.app = application;
    }

    async createEmpleado(req: Request, res: Response): Promise<Response> {
        try {
            const { id, nombre, apellido, cargo, salario, fechaContratacion, usuId, rol } = loadEmpleadoData(req.body);
            const empleado: Empleado = { id, nombre, apellido, cargo, salario, fechaContratacion, usuId, rol };
            const empleadoId = await this.app.createEmpleado(empleado);
            return res
                .status(201)
                .json({ message: "Empleado creado con éxito", empleadoId });
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

    async updateEmpleado(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const dataLoad = loadUpdateEmpleadoData(req.body);
            const updated = await this.app.updateEmpleado(id, dataLoad);
            if (!updated) {
                return res.status(404).json({ error: "Empleado no encontrado o sin cambios" });
            }
            return res.status(200).json({ message: "Empleado actualizado con éxito" });
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

    async getEmpleadoById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const empleado = await this.app.getEmpleadoById(id);
            if (!empleado) {
                return res.status(404).json({ error: "Empleado no encontrado" });
            }
            return res.status(200).json(empleado);
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

    async deleteEmpleado(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const empleado = await this.app.deleteEmpleado(id);
            if (!empleado) {
                return res.status(404).json({ error: "Empleado no encontrado" });
            }
            return res.status(200).json({ message: "Empleado eliminado con éxito" });
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

    async getEmpleadoAllEmpleado(req: Request, res: Response): Promise<Response> {
        try {
            const Empleados = await this.app.getAllEmpleados();
            return res.status(200).json(Empleados);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al traer los Empleados", error });
        }
    }
}
