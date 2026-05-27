import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  buscar(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/buscar?nombre=${nombre}`);
  }

  crear(producto: any): Observable<any> {
    return this.http.post(this.url, producto);
  }

  actualizar(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, producto);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}