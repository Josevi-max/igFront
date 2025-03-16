import { Component, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SpinnerComponent
  ],
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {
  registerForm = new FormGroup({
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
  loading = false;
  constructor(private router: Router, private _authService: AuthService, private toastr: ToastrService) {

  }



  registerUser() {
    if (this.registerForm.valid) {
      this.loading = true;
      this._authService.register(this.registerForm.value).subscribe(
        (response) => {
          this.toastr.info('¡Usuario registrado, redirigiendo al login!', 'Éxito');
          this.router.navigate(['auth/login']);
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.toastr.error(error.error, 'Error');
          this.loading = false;
        }
      );
    }

  }

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


  showPassword(){
    let input = document.querySelector('input[name="password"]') as HTMLInputElement;
    let typeInput = input?.type;
    if(typeInput == 'password'){
      input.type = 'text';
    }
    if(typeInput == 'text'){
      input.type = 'password';
    } 
  }
}
