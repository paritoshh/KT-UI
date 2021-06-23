import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { RouteGuardService } from './route-guard.service';
import { HostComponent } from './sessions/host/host.component';
import { OwnComponent } from './sessions/own/own.component';
import { SessionDetailsComponent } from './sessions/sessions-list/session-details/session-details.component';
import { SessionsListComponent } from './sessions/sessions-list/sessions-list.component';
import { SessionsComponent } from './sessions/sessions.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [RouteGuardService] },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [RouteGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [RouteGuardService] },
  {
    path: 'sessions',
    canActivate: [RouteGuardService],
    component: SessionsComponent, children: [
      { path: 'host', component: HostComponent },
      { path: 'own', component: OwnComponent },
      { path: ':sessionType', component: SessionsListComponent },
      { path: 's/:id', component: SessionDetailsComponent },
      // {path: 's/:id/feedback', component: Fee}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
