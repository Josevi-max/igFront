import { computed, inject, Injectable, input, Signal, signal, WritableSignal } from '@angular/core';
import { AuthApiService } from '../../../infrastructure/api/auth/auth-api.service';
import { AuthManagementService } from '../store/auth-management.service';
import { InputPasswordField, LoginCredentials, LoginResponse, User } from '../../../domain/auth/models/auth.model';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginResponseDto } from '../../../infrastructure/api/auth/auth-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {
  private readonly authApiService = inject(AuthApiService);
  private readonly authManagement = inject(AuthManagementService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private passwordVisible: WritableSignal<boolean> = signal(false);

  public tooglePassword(): void {
    this.passwordVisible.update((value: boolean) => !value);
  }

  public get passwordVisibility(): Signal<InputPasswordField> {
    return computed(() => {
      let result = InputPasswordField.HIDE;
      if (this.passwordVisible()) {
        result = InputPasswordField.SHOW;
      }
      return result;
    });
  }
  
  public login(credentials:LoginCredentials): void {
    this.authApiService.login(credentials).pipe(take(1)).subscribe((response: LoginResponseDto) => {
      this.authManagement.setToken(response.access_token!);
      this.authManagement.setUserData(response.user!);
      this.toastr.success('¡Inicio de sesión correcto!', 'Éxito');
      this.router.navigate(['']);
    });
  }
  
  public register(userData: User): void {
    this.authApiService.register(userData).pipe(take(1)).subscribe(
      () => {
        this.toastr.success('¡Registro correcto, ya puedes iniciar sesión!', 'Éxito');
        this.router.navigate(['auth/login']);
      }
    );
  }
  
  public logout(): void {
    this.authManagement.setToken('');
    this.authManagement.setUserData(null);
  }
}
