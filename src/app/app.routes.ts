import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from './productos/productos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { TerminoscondicionesComponent } from './terminoscondiciones/terminoscondiciones.component';
import { VentasComponent } from './ventas/ventas.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperacion', component: RecuperacionComponent},
  { path: 'proveedores', component: ProveedoresComponent},
  { path: 'terminosCondiciones', component: TerminoscondicionesComponent },
  { path: 'ventas', component: VentasComponent }

];
