import { CompraApplication } from '../../app/comprasApplication.js';
import { Request, Response } from 'express';
import { loadUpdateCompraData } from '../util/compras-update-validation.js';
import { Compra } from '../../domain/compras.js';
import { loadCompraData } from '../util/compras-validation.js';

export class CompraController {
  private app: CompraApplication;
  constructor(application: CompraApplication) {
    this.app = application;
  }
  async createCompra(req: Request, res: Response): Promise<Response> {
    try {
      //validar datos de entrada
      //se hce un reestructuración de los datos
      const { id, total, quantity, date, provider, usuId } = loadCompraData(req.body);
      //crear Compra
      const compra: Compra = { id, total, quantity, date, provider, usuId };
      const compraId = await this.app.createCompras(compra);
      return res.status(201).json({ message: 'Compra creado con exito', compraId });
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
  async updateCompra(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      } //si no es un numero retorna true
      const dataLoad = loadUpdateCompraData(req.body);
      const updated = await this.app.updateCompra(id, dataLoad);
      if (!updated) {
        return res.status(404).json({ error: 'Compra no encontrado o sin cambios' });
      }
      return res.status(200).json({
        message: 'Compra actualizado con éxito',
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
  async getCompraById(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      } //si no es un numero retorna true
      const compra = await this.app.getCompraById(id);
      if (!compra) {
        return res.status(404).json({ error: 'Compra no encontrado' });
      }
      return res.status(200).json(compra);
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

  async deleteCompra(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID invalido' });
      }
      const compra = await this.app.deleteCompra(id);
      if (!compra) {
        return res.status(404).json({ error: 'Compra no encontrado' });
      }
      return res.status(200).json({ message: 'Compra eliminado con exito' });
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
  async getCompraAllCompra(req: Request, res: Response): Promise<Response> {
    try {
      const compras = await this.app.getAllCompras();
      return res.status(200).json(compras);
    } catch (error) {
      return res.status(500).json({ mensaje: 'Error al traer los Compras', error });
    }
  }
}
