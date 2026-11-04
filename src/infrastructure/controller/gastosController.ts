import { GastoApplication } from '../../app/gastosApplication.js';
import { Request, Response } from 'express';
import { loadUpdateGastoData } from '../util/gastos-update-validation.js';
import { Gasto } from '../../domain/gastos.js';
import { loadGastoData } from '../util/gastos-validation.js';

export class GastoController {
  private app: GastoApplication;
  constructor(application: GastoApplication) {
    this.app = application;
  }
  async createGasto(req: Request, res: Response): Promise<Response> {
    try {
      //validar datos de entrada
      //se hce un reestructuración de los datos
      const { id, description, value, date, empId, usuId } = loadGastoData(req.body);
      //crear Gasto
      const gasto: Gasto = { id, description, value, date, empId, usuId };
      const gastoId = await this.app.createGastos(gasto);
      return res.status(201).json({ message: 'Gasto creado con exito', gastoId });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'error interno del servidor',
          details: error.message,
        });
      }
      return res.status(500).json({ error: 'error interno del servidor' });
    }
  }
  async updateGasto(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      } //si no es un numero retorna true
      const dataLoad = loadUpdateGastoData(req.body);
      const updated = await this.app.updateGasto(id, dataLoad);
      if (!updated) {
        return res.status(404).json({ error: 'Gasto no encontrado o sin cambios' });
      }
      return res.status(200).json({
        message: 'Gasto actualizado con éxito',
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Error interno del servidor',
          details: error.message,
        });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  async getGastoById(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      } //si no es un numero retorna true
      const gasto = await this.app.getGastoById(id);
      if (!gasto) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
      }
      return res.status(200).json(gasto);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Error interno del servidor',
          details: error.message,
        });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async deleteGasto(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      }
      const gasto = await this.app.deleteGasto(id);
      if (!gasto) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
      }
      return res.status(200).json({ message: 'Gasto eliminado con exito' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Error interno del servidor',
          details: error.message,
        });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  async getGastoAllGasto(req: Request, res: Response): Promise<Response> {
    try {
      const gastos = await this.app.getAllGastos();
      return res.status(200).json(gastos);
    } catch (error) {
      return res.status(500).json({ mensaje: 'Error al traer los Gastos', error });
    }
  }
}
