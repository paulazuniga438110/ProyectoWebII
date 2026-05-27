import { CommonModule } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  // ✅ CORRECCIÓN SSR: detecta si está en el navegador o en el servidor
  private platformId = inject(PLATFORM_ID);

  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  searchTerm: string = '';

  mostrarFormulario: boolean = false;

  isLoggedIn: boolean = false;
  nombreUsuario: string = '';
  esAdmin: boolean = false;

  nuevoCliente: any = {
    dni: '',
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    direccion: ''
  };

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ CORRECCIÓN SSR: solo ejecuta en el navegador, nunca en el servidor Node.js
    if (isPlatformBrowser(this.platformId)) {
      this.cargarClientes();
      this.verificarSesion();
    }
  }

  verificarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioRaw = localStorage.getItem('usuario');
      if (usuarioRaw) {
        const usuarioParsed = JSON.parse(usuarioRaw);
        this.isLoggedIn = true;
        this.nombreUsuario = usuarioParsed.nombre || 'Administrador';
        this.esAdmin = usuarioParsed.rol?.toUpperCase() === 'ADMIN';
      } else {
        this.isLoggedIn = false;
        this.nombreUsuario = '';
        this.esAdmin = false;
      }
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = [...data];
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  filtrarClientes(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (term === '') {
      this.clientesFiltrados = [...this.clientes];
      return;
    }
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombre?.toLowerCase().includes(term) ||
      c.correo?.toLowerCase().includes(term)
    );
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.resetForm();
    }
  }

  agregarCliente(): void {
    if (!this.nuevoCliente.nombre || !this.nuevoCliente.correo) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    this.clienteService.crear(this.nuevoCliente).subscribe({
      next: () => {
        alert('Cliente registrado correctamente.');
        this.cargarClientes();
        this.toggleFormulario();
      },
      error: () => alert('Error al registrar cliente.')
    });
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.eliminar(id).subscribe({
        next: () => this.cargarClientes(),
        error: () => alert('Error al eliminar cliente.')
      });
    }
  }

  private resetForm(): void {
    this.nuevoCliente = {
      dni: '',
      nombre: '',
      correo: '',
      password: '',
      telefono: '',
      direccion: ''
    };
  }
}