import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
    return this.authService.isLoggedIn()
      .pipe(
        tap(isLoggedIn => {
          if (!isLoggedIn)
            this.router.navigate(['/login']);
        }));
  }
}