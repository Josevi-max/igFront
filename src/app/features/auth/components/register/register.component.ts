import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthFacadeService } from '../../../../core/state/auth/facade/auth-facade.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {
  private readonly authFacade = inject(AuthFacadeService);

  public registerForm:FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    name: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ),
    username: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ),
  });

  public passwordFieldType = this.authFacade.passwordVisibility;


  get emailInvalid(): boolean {
    const emailControl = this.registerForm.get('email');
    return Boolean(emailControl?.touched && (emailControl?.hasError('required') || emailControl?.hasError('email')));
  }

  get passwordInvalid(): boolean {
    const passwordControl = this.registerForm.get('password');
    return Boolean(passwordControl?.touched && (passwordControl?.hasError('required') || passwordControl?.hasError('minlength')));
  }

  get nameInvalid(): boolean {
    const nameControl = this.registerForm.get('name');
    return Boolean(nameControl?.touched && (nameControl?.hasError('required') || nameControl?.hasError('minlength')));
  }

  get usernameInvalid(): boolean {
    const usernameControl = this.registerForm.get('username');
    return Boolean(usernameControl?.touched && (usernameControl?.hasError('required') || usernameControl?.hasError('minlength')));
  }

  public registerUser():void {
    if (this.registerForm.valid) {
      this.authFacade.register(this.registerForm.value);
    }
  }

  public showHidePassword():void {
    this.authFacade.tooglePassword();
  }
}
