import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { debug } from '../helpers/debugOperator';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';


@Injectable()
export class PublicProfileGuard implements CanActivate {
  
  constructor(
    public profileService: ProfileService,
    public router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
    var username = next.params['username'];

    return this.profileService.isPublic(username)
      .pipe(
        debug("PublicProfileGuard.isPublic"),
        tap(isPublic => {
          if (!isPublic)
            this.router.navigate(['/private']);
        }),
        catchError(error => {
          if(!error.ok)
            this.router.navigate(['/404']);
          return of(false);
        }));
  }
}