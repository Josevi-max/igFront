import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root' // Disponible globalmente
})
export class AuthService {

  constructor(private http:HttpClient) {}

  public token = signal<string>(localStorage.getItem('token') ?? '');
  userData = signal<any | null>(localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : null);


  login(credentials:any): Observable<any> {
    return this.http.post(`${config.api.URL_BACKEND}/auth/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        this.token.set(response.access_token);
        this.userData.set(response.user);
      }),
      catchError((err) => {
        console.error('Error en login:', err);
        return throwError(() => err);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${config.api.URL_BACKEND}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.token.set('');
    this.userData.set(null);
  }
}