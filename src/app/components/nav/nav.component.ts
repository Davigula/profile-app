import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { debug } from 'src/app/helpers/debugOperator';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';

interface MessageData {
  bitcoin: any;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy {

  @Output() sidenavToggled = new EventEmitter();
  
  
  user$: Observable<User | null>;
  
  websocket = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin");
  price$!: Observable<number>;
  lastPrice =  0.0;
  greater = true;
  
  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    
  ) { 
    this.websocket.onmessage = (msg) => {
      var price = JSON.parse(msg.data).bitcoin;
      this.greater = price > this.lastPrice ? true : false;
      this.price$ = of(price);
      this.lastPrice = price;
    };
    
    this.user$ = this.authService.user$.pipe(takeUntil(this.unsubscribe$));
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout = () => this.authService.logout();

  userProfile = (event: any) => 
    this.router.navigate(["/profile", event.currentTarget.id ]);

  userProfileEdit = (event: any) => 
    this.router.navigate(["/profile", event.currentTarget.id, "edit" ]);

  toggleSidenav(): void  {
    this.sidenavToggled.emit()
  }

}
