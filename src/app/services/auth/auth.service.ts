import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root' // Disponible globalmente
})
export class AuthService {

  constructor(private http:HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${config.api.URL_BACKEND}/auth/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // Guarda el token
      })
    );
  }

  register(userData: any): Observable<any> {
    debugger;
    return this.http.post(`${config.api.URL_BACKEND}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Verifica si hay un token guardado
  }
}