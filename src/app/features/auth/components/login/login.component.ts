import { Component, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SpinnerComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  loading = false;
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  constructor(private router: Router, private _authService: AuthService, private toastr: ToastrService) {

  }


  loginUser(){
    if(this.loginForm?.valid) {
      this._authService.login(this.loginForm.value).subscribe(
        (response) => {
          //this.toastr.info('¡Usuario autenticado, redirigiendo al home!', 'Éxito');
          this.router.navigate(['']);
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
    const emailControl = this.loginForm.get('email');
    return Boolean(emailControl?.touched && (emailControl?.hasError('required') || emailControl?.hasError('email')));
  }

  get passwordInvalid(): boolean {
    const passwordControl = this.loginForm.get('password');
    return Boolean(passwordControl?.touched && (passwordControl?.hasError('required') || passwordControl?.hasError('minlength')));
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
