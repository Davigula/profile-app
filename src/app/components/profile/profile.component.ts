import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debug } from 'src/app/helpers/debugOperator';
import { Profile } from 'src/app/models/profile.interface';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile$: Observable<Profile | null>;
  
  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { 
    const username= this.route.snapshot.params['username'];
    this.profile$ = this.profileService.getProfile(username)
    // .pipe(debug("docs"));
  }

  ngOnInit(): void {
  }

}

