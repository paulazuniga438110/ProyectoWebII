import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./registro.component.css']
})



export class RegistroComponent {
  nombre = '';
  email = '';
  tel = '';
  password = '';
  confirmacionC = '';
  aceptaTerminos = false;

  mensajeError = '';
  mensajeNombre = '';
  mensajeCorreo = '';
  mensajeTel = '';
  mensajePassword = '';
  mensajeConfirmacion = '';

  constructor(private usuarioService: UsuarioService) { }

  guardarRegistro(): void {

    this.mensajeError = this.mensajeNombre = this.mensajeCorreo =
      this.mensajeTel = this.mensajePassword = this.mensajeConfirmacion = '';

    let camposVacios = 0;

    if (!this.nombre.trim()) { this.mensajeNombre = 'Por favor ingresar el nombre'; camposVacios++; }
    if (!this.email.trim()) { this.mensajeCorreo = 'Por favor ingresar el correo'; camposVacios++; }
    else if (!/^\S+@.*$/.test(this.email)) { this.mensajeCorreo = 'El correo debe tener una palabra seguida de @'; }
    if (!this.tel.trim()) { this.mensajeTel = 'Por favor ingresar el telefono'; camposVacios++; }
    else if (this.tel.length !== 10) { this.mensajeTel = 'El telefono debe tener 10 digitos'; }
    if (!this.password.trim()) { this.mensajePassword = 'Por favor ingresar la contraseña'; camposVacios++; }
    if (!this.confirmacionC.trim()) { this.mensajeConfirmacion = 'Por favor confirmar la contraseña'; camposVacios++; }
    else if (this.password !== this.confirmacionC) { this.mensajeConfirmacion = 'Las contraseñas no coinciden'; }

    if (!this.aceptaTerminos) { this.mensajeError = 'Debes aceptar los términos y condiciones'; return; }
    if (camposVacios > 1) { this.mensajeError = 'Por favor completar todos los campos'; return; }

    if (!this.mensajeNombre && !this.mensajeCorreo && !this.mensajeTel && !this.mensajePassword && !this.mensajeConfirmacion) {
      // Llamada al backend

      this.usuarioService.registrar({
        nombre: this.nombre,
        correo: this.email,
        pass: this.password,
        rol: 'cliente',   
      }).subscribe({
        next: () => alert('¡Registro exitoso!'),
        error: () => alert('Error al registrar. Intenta de nuevo.')
      });
    }
  }

  soloNumeros(event: any): void {
    let valor = event.target.value.replace(/[^0-9]/g, '');
    if (valor.length > 10) { valor = valor.slice(0, 10); }
    event.target.value = valor;
    this.tel = valor;
  }

}

