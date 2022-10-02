import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment as env } from "../../environments/environment";
import { debug } from '../helpers/debugOperator';
import { Profile } from '../models/profile.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profile$ = new BehaviorSubject<Profile | null>(null);

  constructor(private httpClient: HttpClient) {}

  getAll = (): Observable<Profile[]> => 
    this.httpClient.get(env.serverUrl + "/profile") as Observable<Profile[]>;

  isPublic = (username: string): Observable<boolean> => 
    this.httpClient.get(env.serverUrl + "/profile/is-public/" + username) as Observable<boolean>;

  getProfile = (username: string): Observable<Profile> => 
    this.httpClient.get(env.serverUrl + "/profile/" + username) as Observable<Profile>;
  
  update = (profile: Profile): Observable<any> => {
    return this.httpClient.put(env.serverUrl + "/profile", profile);
  }

  upload = (formData: FormData): Observable<any> => {
    return this.httpClient.post(env.serverUrl + "/profile/files", formData)
  }

  deleteFile = (fileId: string): Observable<any> => 
    this.httpClient.delete(env.serverUrl + "/profile/files/" + fileId)
}
