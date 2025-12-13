import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { config } from '../../../../config/config';
import { Observable } from 'rxjs';
import { LoginCredentials, User } from '../../../domain/auth/models/auth.model';
import { LoginResponseDto } from './auth-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  public login(credentials:LoginCredentials): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${config.api.URL_BACKEND}/auth/login`, credentials);
  }

  public register(userData: User): Observable<void> {
    return this.http.post<void>(`${config.api.URL_BACKEND}/auth/register`, userData)
  }

}
