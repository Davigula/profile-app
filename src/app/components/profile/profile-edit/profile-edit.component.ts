import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { debug } from 'src/app/helpers/debugOperator';
import { FileInfo } from 'src/app/models/file-info.interface';
import { Address, Profile, SocialMedia } from 'src/app/models/profile.interface';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  profile!: Profile;
  profile$: Observable<Profile | null>;
  profileForm!: FormGroup<any>;

  imageName = "";
  image$ = new BehaviorSubject<string | null>(null);

  filename = "";
  documents$ = new BehaviorSubject<FileInfo[] | null>(null);
  @ViewChild('fileUpload') fileInputElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
  ) { 
    const username= this.route.snapshot.params['username'];
    this.profile$ = this.profileService.getProfile(username)
      .pipe(
        tap(profile => this.profile = profile),
        tap(profile => this.buildForm(profile)),
        tap(profile => this.image$.next(profile.imageUrl)),
        tap(profile => this.documents$.next(profile.documents))
      );
  }

  ngOnInit(): void {
  }
 
  onImageSelected(event: any) {
    const files = event.target.files;
    const file = files[0];

    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        // this.message = "Only images are supported.";
        return;
    }
    this.imageName = file.name;

    const formData = new FormData();
    formData.append("file", file);

    this.profileService.upload(formData)
      .pipe(
        map(file => file.metadata.url),
        tap(url => this.image$.next(url)),
        tap(url => this.profile.imageUrl = url)
      ).subscribe();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length === 0)
        return;

    const file = files[0];
    this.filename = file.name;
    const formData = new FormData();
    formData.append("file", file);

    this.profileService.upload(formData)
      .pipe(
        map(file => [...this.profile.documents, file]),
        tap(documents => this.profile.documents = documents),
        tap(documents => this.documents$.next(documents)),
      ).subscribe(() => {
        this.filename = "";
        this.fileInputElement.nativeElement.value = "";
      });
  }

  saveProfile = () => {

    var address: Address = {
      street: this.profileForm.controls['street'].value,
      city: this.profileForm.controls['city'].value,
      postCode: this.profileForm.controls['postCode'].value,
      country: this.profileForm.controls['country'].value,
    };

    var socialMedia: SocialMedia[] = [
      { name: "facebook", url: this.profileForm.controls['facebook'].value, },
      { name: "instagram", url: this.profileForm.controls['instagram'].value, },
      { name: "linkedin", url: this.profileForm.controls['linkedin'].value, },
      { name: "github", url: this.profileForm.controls['github'].value, }
    ];

    
      this.profile.userId = this.profileForm.controls['userId'].value;
      this.profile.public = this.profileForm.controls['public'].value;
      this.profile.firstName = this.profileForm.controls['firstName'].value;
      this.profile.lastName = this.profileForm.controls['lastName'].value;
      this.profile.username = this.profileForm.controls['username'].value;
      this.profile.email = this.profileForm.controls['email'].value;
      this.profile.phone = this.profileForm.controls['phone'].value;
      this.profile.motto = this.profileForm.controls['motto'].value;
      this.profile.bio = this.profileForm.controls['bio'].value;
      this.profile.occupations = this.profileForm.controls['occupations'].value.split(','), 
      this.profile.address = address, 
      this.profile.socialMedia = socialMedia;
    
    
    this.profileService.update(this.profile)
      .subscribe(res => console.log('update response: ', res));
  };

  deleteFile = (event: any) => {
    const fileId = event.chip._elementRef.nativeElement.id;
    this.profile.documents = this.profile.documents.filter(doc => doc._id !== fileId)
    this.profileService.deleteFile(fileId)
      .pipe(
        map(() => this.profile.documents.filter(doc => doc._id !== fileId)),
        tap(documents => this.documents$.next(documents)),
        tap(documents => this.profile.documents = documents),
      ).subscribe();
  }
  

  private buildForm(profile: Profile): void {
    this.profileForm = this.formBuilder.group({
      userId: [profile.userId],
      public: [profile.public],

      // Basic Information
      firstName: [profile.firstName, Validators.required],
      lastName: [profile.lastName, Validators.required],
      username: [profile.username, Validators.required],
      email: [profile.email, Validators.required],
      phone: [profile.phone || ''],
      occupations: [profile.occupations?.join(',') || ''],
      motto: [profile.motto || ''],
      bio: [profile.bio || ''],

      // Address
      street: [profile.address?.street || ''],
      city: [profile.address?.city || ''],
      postCode: [profile.address?.postCode || ''],
      country: [profile.address?.country || ''],
      
      // TODO:Add social media separately
      // Social Media
      facebook: [profile.socialMedia![0].url],
      instagram: [profile.socialMedia![1].url],
      linkedin: [profile.socialMedia![2].url],
      github: [profile.socialMedia![3].url],
    });

    
  }

}
