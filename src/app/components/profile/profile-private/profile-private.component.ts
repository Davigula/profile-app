import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-private',
  templateUrl: './profile-private.component.html',
  styleUrls: ['./profile-private.component.css']
})
export class ProfilePrivateComponent implements OnInit {

  user$: Observable<User | null>;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
  }

  toEditProfile = (event: any) => 
    this.router.navigate(["/profile", event.currentTarget.id, "edit"]);

}
