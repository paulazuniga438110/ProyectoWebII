import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private url = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  buscar(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/buscar?nombre=${nombre}`);
  }

  crear(cliente: any): Observable<any> {
    return this.http.post(this.url, cliente);
  }

  actualizar(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, cliente);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}