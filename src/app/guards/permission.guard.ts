import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class PermissionGuard implements CanActivate {
  
  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
    var username = next.params['username'];
    return this.authService.user$
      .pipe(
        map(user => user?.username === username),
        tap(canActive => {
          if (!canActive)
            this.router.navigate(['/404']);
        })
      );
    
  }
}