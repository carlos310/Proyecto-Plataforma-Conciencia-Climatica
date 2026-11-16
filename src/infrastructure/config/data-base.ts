import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "../entities/user.js";
import { Producto } from "../entities/producto.js";
import { Ingresos } from "../entities/ingresos.js";
import { Gastos } from "../entities/gastos.js";
import { Costos } from "../entities/costos.js";
import { Compras } from "../entities/compras.js";
import { Proveedor } from "../entities/proveedores.js";
import { CompraProductos } from "../entities/compra_has_productos.js";
import { Facturas } from "../entities/facturas.js";
import { Clientes } from "../entities/clientes.js";
import { Empleados } from "../entities/empleados.js";
import { Ventas } from "../entities/ventas.js";
import { ProductosHasVentas } from "../entities/productos_has_ventas.js";
import envs from "./environment-vars.js";
dotenv.config();
export const AppDataSource= new DataSource({
    type:"postgres",
    host:"localhost",
    port:Number(envs.DB_PORT),
    username:envs.DB_USER,
    password:envs.DB_PASSWORD,
    database:envs.DB_NAME,
    schema:"aqua_nova",
    synchronize: false, //no se usa en prod
    logging:true,
    entities:[User, Producto, Ingresos, Gastos, Costos, Compras, Proveedor, CompraProductos, Facturas, Clientes, Empleados, Ventas, ProductosHasVentas]
});

//conetar a la DB
export const connectDB=async ()=>  {
    try {
        await AppDataSource.initialize();
        console.log("connectado a la base de datos");
    } catch (error) {
        console.log(error);
        process.exit(1);    //algo ha fallado en el proceso normal cuando sale 1
    }
}