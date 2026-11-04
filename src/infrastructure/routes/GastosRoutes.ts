
import {Router, Request, Response }  from 'express';
import { GastoAdapter } from '../adapter/gastosAdapter.js';
import { GastoApplication } from '../../app/gastosApplication.js';
import { GastoController } from '../controller/gastosController.js';
import { authenticateToken, empleadoOAdmin, soloAdmin } from '../web/authMiddleware.js';

const gastoRouter = Router();
//inicializacion de las capas
const gastoAdapter = new GastoAdapter();
const gastoApp = new GastoApplication(gastoAdapter);
const gastoController = new GastoController(gastoApp);
//definicion de rutas
gastoRouter.post('/gastos', authenticateToken, empleadoOAdmin, async (req: Request, res: Response) => {
  try {
    await gastoController.createGasto(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error en la creación de Gasto', error });
  }
});
gastoRouter.put('/Gasto/:id', authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
  try {
    await gastoController.updateGasto(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error en la cactualización del Gasto', error });
  }
});
gastoRouter.delete('/gastos/:id', authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
  try {
    await gastoController.deleteGasto(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar Gasto por id', error });
  }
});
//se hace el GastoRouter para el get de los emails y como se requierede consultar y se tiene un indice que es el email se pone de la siguiente manera
gastoRouter.get('/gastos/id/:id', authenticateToken, soloAdmin, async (req: Request<{ id: string }>, res: Response) => {
  try {
    await gastoController.getGastoById(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta por id', error });
  }
});

gastoRouter.get('/gastos', authenticateToken, soloAdmin, async (req, res) => {
  try {
    await gastoController.getGastoAllGasto(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta de datos', error });
  }
});
export default gastoRouter;
