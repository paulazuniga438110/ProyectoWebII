import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importación clave para el funcionamiento de ngModel
import { HttpClient } from '@angular/common/http';
import { ProductoService } from '../services/productos.service';

interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descuento: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.component.html',

  styleUrls: ['./productos.component.css'],
  // CORRECCIÓN: Agregamos FormsModule aquí para que las búsquedas y el formulario funcionen
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProductosComponent implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  textoBusqueda: string = '';
  categoriaSeleccionada: string = 'Todas las categorías';


  carrito: any[] = [];
  mostrarCarrito: boolean = false;

  // Variables de control de sesión de usuario y rol
  isLoggedIn: boolean = false;
  nombreUsuario: string = '';
  esAdmin: boolean = false;
  mostrarFormulario: boolean = false;

  nuevoProducto: any = {
    codigo: '',
    nombre: '',
    precio: 0,
    preciov: 0,
    stock: 0,
    categoria: '',
    imagen: '',
    descuento: 0,
    proveedor: { id: null }
  };

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarProductos();

    // Lógica de recuperación de carrito
    if (typeof window !== 'undefined') {

      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        this.carrito = JSON.parse(carritoGuardado);
      }
    }

    // LEER LA SESIÓN CON RETRASO CONTROLADO (EVITA EL BLOQUEO DE SSR)
    setTimeout(() => {
      this.verificarSesion();
    }, 50);
  }

  // --- MÉTODO PARA COMPROBAR LA SESIÓN Y ROL ---
  verificarSesion(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const usuarioRaw = localStorage.getItem('usuario');

      if (token) {
        this.isLoggedIn = true;
        if (usuarioRaw) {
          const usuarioParsed = JSON.parse(usuarioRaw);
          this.nombreUsuario = usuarioParsed.nombre || usuarioParsed.username || usuarioParsed.correo || 'Usuario';
          const rol = usuarioParsed.rol?.toUpperCase() || '';
          this.esAdmin = (rol === 'ADMIN'); // Mantiene la lógica de que el Admin controle la gestión
        } else {
          this.nombreUsuario = 'Usuario';
          this.esAdmin = false;
        }
        this.cdr.detectChanges();
      } else {
        // LÓGICA DE VISITANTE: Al no haber token, se desmarcan los permisos pero el catálogo sigue visible
        this.isLoggedIn = false;
        this.nombreUsuario = '';
        this.esAdmin = false;
        this.cdr.detectChanges();
      }
    }
  }

  // --- MÉTODO PARA EL BOTÓN DE CERRAR SESIÓN ---
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.esAdmin = false;
    this.router.navigate(['/login']);
  }

  // --- MÉTODOS DE NEGOCIO ---
  cargarProductos() {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }


  filtrarProductos() {
    const texto = this.textoBusqueda.toLowerCase();
    const categoria = this.categoriaSeleccionada;

    this.productosFiltrados = this.productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(texto) &&
        (categoria === 'Todas las categorías' || p.categoria === categoria)
    );
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  agregarAlCarrito(producto: Producto) {
    const existe = this.carrito.find((item) => item.nombre === producto.nombre);

    if (existe) {
      existe.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }

    this.guardarCarrito();
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }


  getTotal() {
    return this.carrito.reduce(
      (total, item) => total + (item.preciov || item.precio) * item.cantidad, 0
    );
  }

  aumentarCantidad(item: any): void {
    item.cantidad++;
    this.guardarCarrito();
  }

  disminuirCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      this.eliminarDelCarrito(item);
    }
    this.guardarCarrito();
  }

  eliminarDelCarrito(item: any): void {
    this.carrito = this.carrito.filter(i => i.nombre !== item.nombre);
    this.guardarCarrito();
  }

  vaciarCarrito(): void {
    if (confirm('¿Seguro que deseas vaciar el carrito?')) {
      this.carrito = [];
      this.guardarCarrito();
    }
  }

  getCantidadTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }


  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.resetForm();
    }
  }

  agregarProducto(): void {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    const productoEnviar = {
      codigo: this.nuevoProducto.codigo,
      nombre: this.nuevoProducto.nombre,
      precio: this.nuevoProducto.precio,
      preciov: this.nuevoProducto.preciov,
      stock: this.nuevoProducto.stock,
      categoria: this.nuevoProducto.categoria,
      imagen: this.nuevoProducto.imagen,
      descuento: this.nuevoProducto.descuento,
      proveedor: this.nuevoProducto.proveedor?.id
        ? { id: this.nuevoProducto.proveedor.id }
        : null
    };

    this.productoService.crear(productoEnviar).subscribe({
      next: () => {
        alert('Producto registrado con éxito.');
        this.cargarProductos();
        this.toggleFormulario();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al registrar el producto.');
      }
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => {
          if (err.status === 200 || err.status === 0) {
            this.cargarProductos();
          } else {
            alert('Error al eliminar producto.');
          }
        }
      });
    }
  }

  private resetForm(): void {
    this.nuevoProducto = {
      codigo: '',
      nombre: '',
      precio: 0,
      preciov: 0,
      stock: 0,
      categoria: '',
      imagen: '',
      descuento: 0,
      proveedor: { id: null }
    };
  }
}