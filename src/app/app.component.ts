import { Component } from '@angular/core';
//import { AuthorizationService } from './shared/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //isUserLoggedIn: boolean = false;
  // ngOnInit(): void {
  //   // this.isUserLoggedIn = this.auth.isUserLoggedIn();

  // }

  // constructor(private auth: AuthorizationService) {

  // }
  title = 'KT';
  ismeridian: boolean = true;
  timevalue: Date = new Date();
  meridians = ['12H', '24H'];
}
