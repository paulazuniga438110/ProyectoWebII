import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  // Sesión
  isLoggedIn: boolean = false;
  nombreUsuario: string = '';

  sales = [
    {
      id: "V001",
      date: "2024-09-22",
      client: "María García López",
      products: [
        { name: "Extracto de Ginkgo Biloba", quantity: 2, price: 289 },
        { name: "Té Verde Orgánico", quantity: 1, price: 156 }
      ],
      total: 734,
      status: "Completada",
      paymentMethod: "Tarjeta"
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarSesion();
  }

  verificarSesion(): void {
    if (typeof window !== 'undefined') {
      const usuarioRaw = localStorage.getItem('usuario');
      if (usuarioRaw) {
        this.isLoggedIn = true;
        this.nombreUsuario = JSON.parse(usuarioRaw).nombre || 'Administrador';
      } else {
        this.isLoggedIn = false;
        this.nombreUsuario = '';
      }
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  get totalSales() {
    return this.sales.reduce((s, x) => s + x.total, 0);
  }

  get completedSales() {
    return this.sales.filter(s => s.status === "Completada").length;
  }

  get pendingSales() {
    return this.sales.filter(s => s.status === "Pendiente").length;
  }

  get averageSale() {
    return this.totalSales / this.sales.length;
  }

  getStatusColor(status: string) {
    switch (status) {
      case "Completada": return 'bg-green';
      case "Pendiente": return 'bg-yellow';
      case "Cancelada": return 'bg-red';
      default: return '';
    }
  }

  openDialog() {
    alert("Aquí abrirás tu modal en Angular");
  }
}