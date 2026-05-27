import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../services/proveedor.service';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  products: string[];
  lastOrder: string;
  status: 'Activo' | 'Pendiente';
  rating: number;
}

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})

export class ProveedoresComponent implements OnInit {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  searchTerm: string = '';


  isModalOpen: boolean = false;


  selectedSupplier: Supplier | null = null;
  orderData: any = {};
  isOrderModalOpen: boolean = false;

  // Sesión
  isLoggedIn: boolean = false;
  nombreUsuario: string = '';
  esAdmin: boolean = false;




  newSupplier: any = {
    name: '',
    email: '',
    phone: '',
    address: '',
    ruc: '',
    productsText: '',
  };

  constructor(private router: Router, private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.verificarSesion();
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.listar().subscribe({
      next: (data) => {
        this.suppliers = data.map((p: any) => ({
          id: p.id,
          name: p.nombre,
          email: p.correo,
          phone: p.telefono,
          address: p.direccion,
          products: [],
          lastOrder: '—',
          status: 'Activo' as 'Activo',
          rating: 0
        }));
        this.filteredSuppliers = [...this.suppliers];
      },
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }

  verificarSesion(): void {
    if (typeof window !== 'undefined') {
      const usuarioRaw = localStorage.getItem('usuario');
      if (usuarioRaw) {
        const usuarioParsed = JSON.parse(usuarioRaw);
        this.isLoggedIn = true;
        this.nombreUsuario = usuarioParsed.nombre || 'Administrador';
        this.esAdmin = usuarioParsed.rol?.toUpperCase() === 'ADMIN';
        console.log('ROL:', usuarioParsed.rol);
        console.log('ES ADMIN:', this.esAdmin);
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

  filterSuppliers(): void {
    const term = this.searchTerm.toLowerCase();
    if (term === '') {
      this.filteredSuppliers = [...this.suppliers];
      return;
    }

    this.filteredSuppliers = this.suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(term) ||
      supplier.products.some(p => p.toLowerCase().includes(term))
    );
  }

  openModal(): void { this.isModalOpen = true; }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  closeModalOnOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) this.closeModal();
  }

  addSupplier(): void {
    if (!this.newSupplier.name || !this.newSupplier.email || !this.newSupplier.phone) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    const proveedorEnviar = {
      nombre: this.newSupplier.name.trim(),
      correo: this.newSupplier.email.trim(),
      telefono: this.newSupplier.phone.trim(),
      direccion: this.newSupplier.address?.trim() || '',
      ruc: this.newSupplier.ruc?.trim() || ''
    };

    this.proveedorService.crear(proveedorEnviar).subscribe({
      next: (nuevo) => {
        const supplier: Supplier = {
          id: nuevo.id,
          name: nuevo.nombre,
          email: nuevo.correo,
          phone: nuevo.telefono,
          address: nuevo.direccion,
          products: [],
          lastOrder: '—',
          status: 'Activo',
          rating: 0
        };
        this.suppliers.push(supplier);
        this.filterSuppliers();
        this.closeModal();
        alert('Proveedor registrado correctamente.');
      },
      error: () => alert('Error al registrar proveedor.')
    });
  }

  deleteSupplier(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
      this.proveedorService.eliminar(id).subscribe({
        next: () => {
          this.suppliers = this.suppliers.filter(s => s.id !== id);
          this.filterSuppliers();
        },
        error: (err: any) => {
          if (err.status === 200 || err.status === 0) {
            this.suppliers = this.suppliers.filter(s => s.id !== id);
            this.filterSuppliers();
          } else {
            alert('Error al eliminar proveedor.');
          }
        }
      });
    }
  }

  contactSupplier(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  newOrder(id: number): void {
    const supplier = this.suppliers.find(s => s.id === id);
    if (!supplier) return;
    this.selectedSupplier = supplier;
    this.orderData = {
      date: new Date().toISOString().substring(0, 10),
      quantities: supplier.products.reduce((acc, p) => {
        acc[p] = 0;
        return acc;
      }, {} as any)
    };
    this.isOrderModalOpen = true;
  }

  getActiveCount(): number {
    return this.suppliers.filter(s => s.status === 'Activo').length;
  }

  getPendingCount(): number {
    return this.suppliers.filter(s => s.status === 'Pendiente').length;
  }

  getAverageRating(): string {
    if (this.suppliers.length === 0) return '0';
    const total = this.suppliers.reduce((sum, s) => sum + s.rating, 0);
    return (total / this.suppliers.length).toFixed(1);
  }

  getRatingStars(rating: number): string {
    const filled = '★'.repeat(Math.round(rating));
    const empty = '☆'.repeat(5 - Math.round(rating));
    return filled + empty;
  }

  confirmOrder(): void {
    if (!this.selectedSupplier) return;
    this.selectedSupplier.lastOrder = this.orderData.date;
    alert('Pedido registrado con éxito.');
    this.isOrderModalOpen = false;
  }

  closeOrderModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.isOrderModalOpen = false;
    }
  }

  private resetForm(): void {
    this.newSupplier = { name: '', email: '', phone: '', address: '', ruc: '', productsText: '' };
  }
}