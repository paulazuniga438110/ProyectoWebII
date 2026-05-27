import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  email: string = '';
  password: string = '';
  mensajeError: string = '';
  mensajeEmail: string = '';
  mensajePassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  iniciarSesion() {
    this.mensajeError = '';
    this.mensajeEmail = '';
    this.mensajePassword = '';

    if (!this.email.trim() && !this.password.trim()) {
      this.mensajeError = 'Por favor, complete todos los campos';
      return;
    }
    if (!this.email.trim()) {
      this.mensajeEmail = 'Por favor, ingrese su correo electrónico';
      return;
    }
    if (!this.password.trim()) {
      this.mensajePassword = 'Por favor, ingrese su contraseña';
      return;
    }

    this.http.post<any>(`${environment.apiUrl}/auth/login`, {
      correo: this.email,
      pass: this.password
    }).subscribe({
      next: (response) => {
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response));

        // Redirige según rol
        const rol = response.rol.toUpperCase();
        if (rol === 'ADMIN') {
          this.router.navigate(['/clientes']);
        } else if (rol === 'CLIENTE') {
          this.router.navigate(['/productos']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.mensajeError = 'Correo o contraseña incorrectos';
      }
    });
  }
}