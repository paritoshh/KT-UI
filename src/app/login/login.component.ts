import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../shared/authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ngOnInit(): void {

  }
  emailVerificationMessage: boolean = false;

  constructor(private auth: AuthorizationService,
              private _router: Router) {

  }

  onSubmit(form: NgForm) {

    const email = form.value.email;
    const password = form.value.password;
    this.auth.signIn(email, password)
    .subscribe(
      data => {
        console.log('in success method : ' + data);
        console.log('username : ' + email);
        this._router.navigate(['home']);
      }
    );  
  }
}