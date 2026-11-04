import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse, } from '@angular/ssr/node';
import 'dotenv/config'; // carga automáticamente las variables de .env
import express from 'express';
import { dirname, join } from 'node:path';
import { connectDB } from './infrastructure/config/data-base.js';
import envs from "./infrastructure/config/environment-vars.js";
// Importa tus routers ya definidos en carpetas individuales
import userRouter from "./infrastructure/routes/UserRoutes.js";
import productoRouter from "./infrastructure/routes/ProductoRoutes.js";
import ingresoRouter from "./infrastructure/routes/IngresosRoutes.js";
import gastoRouter from "./infrastructure/routes/GastosRoutes.js";
import costoRouter from "./infrastructure/routes/CostosRoutes.js";
import compraRouter from "./infrastructure/routes/ComprasRoutes.js";
import { fileURLToPath } from 'node:url';
// Avoid using import.meta which can cause issues when targeting CommonJS.
// Use process.cwd() to resolve the browser static folder at runtime.
const __dirname = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = join(__dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();
/**
 * Middlewares globales
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * Rutas API (montadas desde tus archivos individuales)
 */
app.use("/api/usuarios", userRouter);
app.use("/api/productos", productoRouter);
app.use("/api/ingresos", ingresoRouter);
app.use("/api/gastos", gastoRouter);
app.use("/api/costos", costoRouter);
app.use("/api/compras", compraRouter);
/**
 * Archivos estáticos de Angular
 */
app.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
}));
/**
 * SSR de Angular: cualquier request que no sea API ni estático
 */
app.use((req, res, next) => {
    angularApp
        .handle(req)
        .then((response) => response ? writeResponseToNodeResponse(response, res) : next())
        .catch(next);
});
/**
 * Inicio del servidor
 */
// Avoid using import.meta.url (not allowed when building to CommonJS).
// Use process.argv[1] (the executed script) as a fallback to determine if this is the main module.
if (isMainModule(import.meta.url)) {
    connectDB().then(() => {
        const port = envs.PORT || 4000;
        app.listen(port, (error) => {
            if (error)
                throw error;
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    });
}
export const reqHandler = createNodeRequestHandler(app);
/**
 * Example e Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */
/**
 * Serve static files from /browser
 */
/**
 * Handle all other requests by rendering the Angular application.
 */
/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * El puerto se toma de .env (PORT) o se usa 4000 por defecto.
 */
