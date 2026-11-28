import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./infrastructure/config/data-base.js";
import envs from "./infrastructure/config/environment-vars.js";

// Routers
import userRouter from "./infrastructure/routes/UserRoutes.js";
import productoRouter from "./infrastructure/routes/ProductoRoutes.js";
import ingresoRouter from "./infrastructure/routes/IngresosRoutes.js";
import gastoRouter from "./infrastructure/routes/GastosRoutes.js";
import costoRouter from "./infrastructure/routes/CostosRoutes.js";
import compraRouter from "./infrastructure/routes/ComprasRoutes.js";
import proveedorRouter from "./infrastructure/routes/ProveedorRoutes.js";
import clienteRouter from "./infrastructure/routes/ClienteRoutes.js";
import empleadoRouter from "./infrastructure/routes/EmpleadoRoutes.js";
import ventaRouter from "./infrastructure/routes/VentaRoutes.js";
import facturaRouter from "./infrastructure/routes/FacturaRoutes.js";
import agenteRouter from "./infrastructure/routes/AgenteRoutes.js";
import cors from "cors";

dotenv.config();
//middlewares
const app = express();
// Log de cada solicitud: método, ruta, código de respuesta y tiempo (para ver en la terminal lo que llega del front)
app.use((req, res, next) => {
  const inicio = Date.now();
  res.on("finish", () => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - inicio} ms)`);
  });
  next();
});
app.use(cors({
  origin: "http://localhost:4200", // tu frontend Angular en dev
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/usuarios", userRouter);
app.use("/api/productos", productoRouter);
app.use("/api/ingresos", ingresoRouter);
app.use("/api/gastos", gastoRouter);
app.use("/api/costos", costoRouter);
app.use("/api/compras", compraRouter);
app.use("/api/proveedores", proveedorRouter);
app.use("/api/clientes", clienteRouter);
app.use("/api/empleados", empleadoRouter);
app.use("/api/ventas", ventaRouter);
app.use("/api/facturas", facturaRouter);
app.use("/api/tickets-agente", agenteRouter);

// Start server
connectDB().then(() => {
  const port = envs.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend escuchando en http://localhost:${port}`);
  });
});
