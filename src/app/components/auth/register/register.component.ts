import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs';
import { debug } from 'src/app/helpers/debugOperator';
import { RegisterModel } from 'src/app/models/register.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public hide = true;
  public error = "";

  public registerForm!: FormGroup<any>;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { this.buildForm(); }

  ngOnInit(): void {
  }

  register() {
    this.error = "";
    const { password, confirmPassword } = this.registerForm?.value;
    if(password !== confirmPassword){
      this.error = "Password and confirm password do not match.";
      return;
    }

    this.authService.register(this.registerForm?.value as RegisterModel)
      .pipe(
        debug("register"),
        tap((user: User) => this.router.navigate(['/profile', user.username])),
        catchError(error => this.error = error.error)
      ).subscribe();
  }

  private buildForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      rememberMe: [false, Validators.required]
    });
  }
}

