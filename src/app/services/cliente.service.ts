import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private url = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url, { headers: this.getHeaders() });
  }

  buscar(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/buscar?nombre=${nombre}`, { headers: this.getHeaders() });
  }

  crear(cliente: any): Observable<any> {
    return this.http.post(this.url, cliente, { headers: this.getHeaders() });
  }

  actualizar(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, cliente, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { headers: this.getHeaders() });
  }
}