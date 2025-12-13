import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { User } from '../../../domain/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthManagementService {

  private  token:WritableSignal<string> = signal<string>(localStorage.getItem('token') ?? '');
  private  userData:WritableSignal<User | null> = signal<User | null>(localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : null);

  public get tokenValue(): Signal<string> {
    return this.token;
  }

  public get userDataValue(): Signal<User | null> {
    return this.userData;
  }

  public setToken(value:string): void {
    this.token.set(value);
    localStorage.setItem('token', value);
  }

  public setUserData(value:User | null): void {
    this.userData.set(value);
    localStorage.setItem('userData', JSON.stringify(value));
  }
}
