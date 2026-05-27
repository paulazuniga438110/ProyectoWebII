import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private url = `${environment.apiUrl}/proveedores`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  buscar(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/buscar?nombre=${nombre}`);
  }

  crear(proveedor: any): Observable<any> {
    return this.http.post(this.url, proveedor);
  }

  actualizar(id: number, proveedor: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, proveedor);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}