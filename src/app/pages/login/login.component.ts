import { User } from './../../interfaces/user';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../interfaces/login-response';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!: FormGroup;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = builder.group({
      "email": new FormControl(null, [Validators.required, Validators.email]),
      "password": new FormControl(null, [Validators.required])
    });
  }

  login() {
    const email: string = this.form.value.email;
    const pass: string = this.form.value.password;

    this.authService.login(email, pass).subscribe({
      next: (response) => {
        const loginResponse: LoginResponse = response as LoginResponse;
        const user: User = {
          token: loginResponse.token,
          _id: loginResponse.id,
          role: loginResponse.role,
          email: loginResponse.email ,
          name: loginResponse.name
        };

        this.authService.saveUser(user);
        this.router.navigateByUrl("/");
      },
      error: () => {
        
      }
    });
  }
}
