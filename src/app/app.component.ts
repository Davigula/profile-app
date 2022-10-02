import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { exhaustMap, filter, Observable, tap } from 'rxjs';
import { debug } from './helpers/debugOperator';
import { User } from './models/user.interface';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentYear = new Date().getFullYear();

  sidenavOpened = false;
  
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
    this.authService.isLoggedIn()
      .pipe(exhaustMap(() => this.authService.loadUserData()))
      .subscribe();
  }

  logout = () => 
    this.authService.logout();

  toProfile = (event: any) => 
    this.router.navigate(["/profile", event.currentTarget.id]);
  
  toEditProfile = (event: any) => 
    this.router.navigate(["/profile", event.currentTarget.id, "edit"]);

}
