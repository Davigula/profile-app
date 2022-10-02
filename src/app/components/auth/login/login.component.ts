import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError, skipWhile, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { LoginModel } from 'src/app/models/login.model';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public hide = true;
  public error = "";

  public loginForm!: FormGroup<any>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { this.buildForm() }

  login() {
    this.error = "";
    this.authService.login(this.loginForm?.value as LoginModel)
      .pipe(
        tap((user: User) => this.router.navigate(['/profile', user.username])),
        catchError(error => this.error = error.error)
      ).subscribe();
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false, Validators.required]
    });
  }

}
