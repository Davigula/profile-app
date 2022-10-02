import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { ProfilePrivateComponent } from './components/profile/profile-private/profile-private.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PublicProfileGuard } from './guards/public-profile.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [PublicProfileGuard] },
  { path: 'profile/:username/edit', component: ProfileEditComponent, canActivate: [AuthGuard, PermissionGuard] },
  { path: 'private', component: ProfilePrivateComponent },
  { path: '404', component: NotFoundComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
