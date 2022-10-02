import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/models/profile.interface';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profiles$: Observable<Profile[]>;
  constructor(private profileService: ProfileService) {
    this.profiles$ = this.profileService.getAll();
  }

  ngOnInit(): void {
  }

}
