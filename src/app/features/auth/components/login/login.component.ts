import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthFacadeService } from '../../../../core/state/auth/facade/auth-facade.service';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  public loginForm:FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  private readonly _authFacadeService = inject(AuthFacadeService);

  public passwordFieldType = this._authFacadeService.passwordVisibility;

  get emailInvalid(): boolean {
    const emailControl = this.loginForm.get('email');
    return Boolean(emailControl?.touched && (emailControl?.hasError('required') || emailControl?.hasError('email')));
  }

  get passwordInvalid(): boolean {
    const passwordControl = this.loginForm.get('password');
    return Boolean(passwordControl?.touched && (passwordControl?.hasError('required') || passwordControl?.hasError('minlength')));
  }

  public loginUser():void{
    if(this.loginForm?.valid) {
      this._authFacadeService.login(this.loginForm.value);
    }
  }

  public tooglePassword():void {
    this._authFacadeService.tooglePassword();
  }
}
