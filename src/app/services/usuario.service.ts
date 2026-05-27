import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  login(correo: string): Observable<any> {
    return this.http.get(`${this.url}/login/${correo}`);
  }

  registrar(usuario: any): Observable<any> {
    return this.http.post(this.url, usuario);
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}