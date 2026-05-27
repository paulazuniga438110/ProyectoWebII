import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  isLoggedIn: boolean = false;
  nombreUsuario: string = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Leer la sesión con un pequeño retraso para evitar problemas con SSR (Server-Side Rendering)
    setTimeout(() => {
      this.verificarSesion();
    }, 50);
  }

  // Comprueba si hay un usuario activo al cargar la página de Inicio
  verificarSesion(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const usuarioRaw = localStorage.getItem('usuario');

      if (token) {
        this.isLoggedIn = true;
        if (usuarioRaw) {
          const usuarioParsed = JSON.parse(usuarioRaw);
          // Recupera el nombre disponible tal como lo hace en Productos
          this.nombreUsuario = usuarioParsed.nombre || usuarioParsed.username || usuarioParsed.correo || 'Usuario';
        } else {
          this.nombreUsuario = 'Usuario';
        }
        this.cdr.detectChanges(); // Fuerza a Angular a pintar el nombre de inmediato
      } else {
        this.isLoggedIn = false;
        this.nombreUsuario = '';
        this.cdr.detectChanges();
      }
    }
  }

  // Método para el botón de Cerrar Sesión del Header en Inicio
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.nombreUsuario = '';
    this.router.navigate(['/login']);
  }
}