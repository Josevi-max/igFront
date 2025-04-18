import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
+
  describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authService: jest.Mocked<AuthService>;
    let toastrService: jest.Mocked<ToastrService>;
    let router: Router;
    let httpMock: HttpTestingController;
    beforeEach(async () => {
      const authServiceSpy = {
        register: jest.fn()
      } as unknown as jest.Mocked<AuthService>;
      const toastrServiceSpy = {
        info: jest.fn(),
        error: jest.fn()
      } as unknown as jest.Mocked<ToastrService>;
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule,RegisterComponent],
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          { provide: ToastrService, useValue: toastrServiceSpy }
        ]
      });

      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
      toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
      router = TestBed.inject(Router);
      jest.spyOn(router, 'navigate');
    });
    it('should register user and redirect to login on success', () => {
      const mockResponse = { message: 'User registered successfully' };
      authService.register.mockReturnValue(of(mockResponse));
      component.registerForm = { valid: true, value: { username: 'test', password: '123456' } } as any;
      component.registerUser();
      expect(authService.register).toHaveBeenCalledWith(component.registerForm.value);
      expect(toastrService.info).toHaveBeenCalledWith('¡Usuario registrado, redirigiendo al login!', 'Éxito');
      expect(router.navigate).toHaveBeenCalledWith(['auth/login']);
      expect(component.loading).toBe(false);
    });


    it('Show and hide password', () => {
      const input = fixture.nativeElement.querySelector('input[name="password"]');
      component.showPassword();
      fixture.detectChanges();
      expect(input.type).toBe('text');
      component.showPassword();
      fixture.detectChanges();
      expect(input.type).toBe('password');
    });
  });
