import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { AuthorizationService } from './shared/authorization.service';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpIntercepterBasicAuthService } from './http/http-intercepter-basic-auth.service';
import { HomeComponent } from './home/home.component';
import { SessionsService } from './shared/sessions-service';
import { SessionsListComponent } from './sessions/sessions-list/sessions-list.component';
import { SessionDetailsComponent } from './sessions/sessions-list/session-details/session-details.component';
import { AuthGuard } from './auth-guard.service';
import { SessionsComponent } from './sessions/sessions.component';
import { HostComponent } from './sessions/host/host.component';
import { OwnComponent } from './sessions/own/own.component';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackComponent } from './sessions/sessions-list/session-details/feedback/feedback.component';
// Datepicker module
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RouteMessageComponent } from './route-message/route-message.component';
import { HttpErrorInterceptor } from './shared/http-error-interceptor';
import { RouteMessageService } from './route-message.service';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    HomeComponent,
    SessionsComponent,
    SessionDetailsComponent,
    SessionsListComponent,
    HostComponent,
    OwnComponent,
    FeedbackComponent,
    RouteMessageComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule, DateTimePickerModule,
    DatePickerModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: AuthorizationService },
    { provide: SessionsService },
    { provide: ProfileService },
    {provide: RouteMessageService},
    { provide: ProfileComponent },
    { provide: AuthGuard },
    { provide: DatePipe },
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterBasicAuthService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
