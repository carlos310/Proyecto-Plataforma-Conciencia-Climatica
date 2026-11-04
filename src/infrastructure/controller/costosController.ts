import { CostoApplication } from '../../app/costosApplication.js';
import { Request, Response } from 'express';
import { loadUpdateCostoData } from '../util/costos-update-validation.js';
import { Costo } from '../../domain/costos.js';
import { loadCostoData } from '../util/costos-validation.js';

export class CostoController {
  private app: CostoApplication;
  constructor(application: CostoApplication) {
    this.app = application;
  }
  async createCosto(req: Request, res: Response): Promise<Response> {
    try {
      //validar datos de entrada
      //se hce un reestructuración de los datos
      const { id, description, value, date, source, empId, usuId } = loadCostoData(req.body);
      //crear Costo
      const costo: Costo = { id, description, value, date, source, empId, usuId };
      const costoId = await this.app.createCostos(costo);
      return res.status(201).json({ message: 'Costo creado con exito', costoId });
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
  async updateCosto(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      } //si no es un numero retorna true
      const dataLoad = loadUpdateCostoData(req.body);
      const updated = await this.app.updateCosto(id, dataLoad);
      if (!updated) {
        return res.status(404).json({ error: 'Costo no encontrado o sin cambios' });
      }
      return res.status(200).json({
        message: 'Costo actualizado con éxito',
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
  async getCostoById(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      } //si no es un numero retorna true
      const costo = await this.app.getCostoById(id);
      if (!costo) {
        return res.status(404).json({ error: 'Costo no encontrado' });
      }
      return res.status(200).json(costo);
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

  async deleteCosto(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      }
      const costo = await this.app.deleteCosto(id);
      if (!costo) {
        return res.status(404).json({ error: 'Costo no encontrado' });
      }
      return res.status(200).json({ message: 'Costo eliminado con exito' });
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
  async getCostoAllCosto(req: Request, res: Response): Promise<Response> {
    try {
      const costos = await this.app.getAllCostos();
      return res.status(200).json(costos);
    } catch (error) {
      return res.status(500).json({ mensaje: 'Error al traer los Costos', error });
    }
  }
}
