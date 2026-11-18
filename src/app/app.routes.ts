import { Routes } from '@angular/router';
import { Ventas } from './pages/ventas/ventas';
import { RecursosHidricos } from './pages/recursos-hidricos/recursos-hidricos';
import { Home } from './pages/home/home';
import { Amenazas } from './pages/amenazas/amenazas';
import { UserDeletionForm } from './pages/user-deletion-form/user-deletion-form';
import { UserEditionForm } from './pages/user-edition-form/user-edition-form';
import { SignInForm } from './pages/sign-in-form/sign-in-form';
import { ProductosForm } from './pages/productos-form/productos-form';
import { ProductosDeleteForm } from './pages/productos-delete-form/productos-delete-form';
import { ProductosEditForm } from './pages/productos-edit-form/productos-edit-form';
import { ProductosDashboard } from './pages/productos-dashboard/productos-dashboard';
import { ComprasProductosCreate } from './pages/compras-productos-create/compras-productos-create';
import { ComprasProductosDelete } from './pages/compras-productos-delete/compras-productos-delete';
import { ComprasProductosEdit } from './pages/compras-productos-edit/compras-productos-edit';
import { CostosCreate } from './pages/costos-create/costos-create';
import { CostosDelete } from './pages/costos-delete/costos-delete';
import { CostosEdit } from './pages/costos-edit/costos-edit';
import { GastosCreate } from './pages/gastos-create/gastos-create';
import { GastosDelete } from './pages/gastos-delete/gastos-delete';
import { GastosEdit } from './pages/gastos-edit/gastos-edit';
import { IngresosCreate } from './pages/ingresos-create/ingresos-create';
import { IngresosDelete } from './pages/ingresos-delete/ingresos-delete';
import { IngresosEdit } from './pages/ingresos-edit/ingresos-edit';
import { ProveedoresCreateComponent } from './pages/proveedores-create/proveedores-create';
import { ProveedoresEditComponent } from './pages/proveedores-edit/proveedores-edit';
import { ProveedoresDeleteComponent } from './pages/proveedores-delete/proveedores-delete';
import { ClientesCreate } from './pages/clientes-create/clientes-create';
import { ClientesEdit } from './pages/clientes-edit/clientes-edit';
import { ClientesDelete } from './pages/clientes-delete/clientes-delete';
import { EmpleadosCreate } from './pages/empleados-create/empleados-create';
import { EmpleadosEditComponent } from './pages/empleados-edit/empleados-edit';
import { EmpleadosDeleteComponent } from './pages/empleados-delete/empleados-delete';
import { VentasCreateComponent } from './pages/ventas-create/ventas-create';
import { VentasEditComponent } from './pages/ventas-edit/ventas-edit';
import { VentasDeleteComponent } from './pages/ventas-delete/ventas-delete';
import { FacturasCreateComponent } from './pages/facturas-create/facturas-create';
import { FacturasEditComponent } from './pages/facturas-edit/facturas-edit';
import { FacturasDeleteComponent } from './pages/facturas-delete/facturas-delete';
import { LogInForm } from './pages/log-in-form/log-in-form';
import { rolGuard } from './rol.guard';
import { ADMIN, CLIENTE, EMPLEADO } from './roles';

export const routes: Routes = [
    // Públicas
    {path:'', component:Home},
    {path:'recursosHidricos', component:RecursosHidricos},
    {path:'ventas', component:Ventas},
    {path:'amenazas', component:Amenazas},
    {path:'signIn', component:SignInForm},
    {path:'login', component:LogInForm},

    //  tabla de productos
    {path:'productosDashboard', component: ProductosDashboard},

    // Empleado: crear registros
    {path:'ingresarProductos', component:ProductosForm, canActivate:[rolGuard], data:{roles: EMPLEADO}},
    {path:'compras-productos-create', component:ComprasProductosCreate, canActivate:[rolGuard], data:{roles: EMPLEADO}},
    {path:'costos-create', component:CostosCreate, canActivate:[rolGuard], data:{roles: EMPLEADO}},
    {path:'gastos-create', component:GastosCreate, canActivate:[rolGuard], data:{roles: EMPLEADO}},
    {path:'ingresos-create', component:IngresosCreate, canActivate:[rolGuard], data:{roles: EMPLEADO, CLIENTE}},

    // Admin: editar y borrar
    {path:'editarProductos', component:ProductosEditForm, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'borrarProductos', component:ProductosDeleteForm, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'compras-productos-edit', component:ComprasProductosEdit, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'compras-productos-delete', component:ComprasProductosDelete, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'costos-edit', component:CostosEdit, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'costos-delete', component:CostosDelete, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'gastos-edit', component:GastosEdit, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'gastos-delete', component:GastosDelete, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'ingresos-edit', component:IngresosEdit, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'ingresos-delete', component:IngresosDelete, canActivate:[rolGuard], data:{roles: ADMIN}},

    // Proveedores
    {path:'proveedores-create', component:ProveedoresCreateComponent, canActivate:[rolGuard], data:{roles: EMPLEADO}},
    {path:'proveedores-edit', component:ProveedoresEditComponent, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'proveedores-delete', component:ProveedoresDeleteComponent, canActivate:[rolGuard], data:{roles: ADMIN}},

    // Clientes
    {path:'clientes-create', component:ClientesCreate, canActivate:[rolGuard], data:{roles: EMPLEADO}},
    {path:'clientes-edit', component:ClientesEdit, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'clientes-delete', component:ClientesDelete, canActivate:[rolGuard], data:{roles: ADMIN}},

    // Empleados
    {path:'empleados-create', component:EmpleadosCreate, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'empleados-edit', component:EmpleadosEditComponent, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'empleados-delete', component:EmpleadosDeleteComponent, canActivate:[rolGuard], data:{roles: ADMIN}},

    // Ventas
    {path:'ventas-create', component:VentasCreateComponent, canActivate:[rolGuard], data:{roles: EMPLEADO}},
    {path:'ventas-edit', component:VentasEditComponent, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'ventas-delete', component:VentasDeleteComponent, canActivate:[rolGuard], data:{roles: ADMIN}},

    // Facturas
    {path:'facturas-create', component:FacturasCreateComponent, canActivate:[rolGuard], data:{roles: EMPLEADO}},
    {path:'facturas-edit', component:FacturasEditComponent, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'facturas-delete', component:FacturasDeleteComponent, canActivate:[rolGuard], data:{roles: ADMIN}},

    {path:'user-edition-form', component:UserEditionForm, canActivate:[rolGuard], data:{roles: ADMIN}},
    {path:'user-deletion-form', component:UserDeletionForm, canActivate:[rolGuard], data:{roles: ADMIN}},

    {path:'**', redirectTo:''}
];
