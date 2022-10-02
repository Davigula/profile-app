import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment as env } from "../../environments/environment";
import { User } from '../models/user.interface';
import jwt_decode from 'jwt-decode';
import { Token } from '../models/token.interface';
import { Router } from '@angular/router';
import { RegisterModel } from '../models/register.interface';
import { LoginModel } from '../models/login.model';
import { debug } from '../helpers/debugOperator';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }

  login = (loginForm: LoginModel): Observable<any> => {
    return this.httpClient.post(env.serverUrl + "/auth/login", loginForm).pipe(
      tap(user => {
        if(user) {
          console.log(user);
          this.user$.next(user as User);
          localStorage.setItem("user", JSON.stringify(user));
        }
      }),
    );
  }

  register = (registerForm: RegisterModel): Observable<any> => {
    return this.httpClient.post(env.serverUrl + "/auth/register", registerForm)
      .pipe(
        debug("register from service"),
        tap(user => {
          console.log(user);
          if(user) {
            this.user$.next(user as User);
            localStorage.setItem("user", JSON.stringify(user));
          }
        }),
      );
  }

  logout = (): void => {
    localStorage.removeItem("user");
    this.user$.next(null);
    this.router.navigate(["/login"]);
    
  }

  loadUserData = (): Observable<void> => {
    const user = this.getTokenPayload() as User | null;

    if(user)
      this.user$.next(user);
    return of();
  }

  isLoggedIn = (): Observable<boolean> => {
    var token = this.getTokenPayload();
    return of(!!token && (token?.exp > Date.now() / 1000));
  }

  getToken = (): string => {
    var localUser = localStorage.getItem("user");
    if(localUser)
      return JSON.parse(localUser).token;
    return "";
  }

  getTokenPayload = (): Token | null => {
    var localUser = localStorage.getItem("user");
    var token;
    if(localUser){
      token = JSON.parse(localUser).token;
      return jwt_decode(token) as Token;
    }
    return null;
  }
}
