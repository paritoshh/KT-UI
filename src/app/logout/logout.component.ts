import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../shared/authorization.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthorizationService) { }

  ngOnInit(): void {

    this.authenticationService.logOut();
  }

}
