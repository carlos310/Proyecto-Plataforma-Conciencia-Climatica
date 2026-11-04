import { Component,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {login, getMe} from "../../../../src/infrastructure/adapter/authService.js";
import { UsersMainForm } from "../../components/users-main-form/users-main-form";
@Component({
  selector: 'app-log-in-form',
  standalone: true,
  imports: [UsersMainForm,CommonModule],
  templateUrl: './log-in-form.html',
  styleUrls: ['./log-in-form.css'],
})
export class LogInForm {
  datosForm: { email: string; contrasena: string } | null = null;
  mensajeError: string = '';

  recibirDatos(datos: { email: string; contrasena: string }) {
    this.datosForm = datos;
  }

  async handleLogin() {
    if (!this.datosForm) return;
    try {
      await login(this.datosForm.email, this.datosForm.contrasena);
      const user = await getMe();
      console.log("Usuario autenticado:", user);
      alert(`Usuario Logueado con exito, bienvenido ${user.name}`);
    } catch (error) {
      this.mensajeError = "Credenciales inválidas";
    }
  }
}

  

