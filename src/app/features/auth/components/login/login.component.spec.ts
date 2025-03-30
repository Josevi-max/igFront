import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let router: Router;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['info', 'error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule,LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should redirect home if success', () => {
    component.loginForm = {
      valid: true,
      value: {
        email: 'test@gmail.com',
        password: '123456789',
      }
    } as any;
    authServiceSpy.login.and.returnValue(of({ message: 'user logged' }));
    component.loginUser();
    expect(authServiceSpy.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(router.navigate).toHaveBeenCalledWith(['']);
    expect(toastrSpy.info).not.toHaveBeenCalled();
    expect(toastrSpy.error).not.toHaveBeenCalled();
  });

  it('should show an error message after fail', () => {
    component.loginForm = {
      valid: true,
      value: {
        email: 'test@gmail.com',
        password: '123456789',
      }
    } as any;
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: 'Login failed' })));
    component.loginUser();
    expect(authServiceSpy.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(toastrSpy.error).toHaveBeenCalledWith('Login failed', 'Error');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should change type password to text', ()=> {
    const input = document.querySelector('input[name="password"]') as HTMLInputElement;
    component.showPassword();
    fixture.detectChanges();
    expect(input.type).toBe('text');
  })
});