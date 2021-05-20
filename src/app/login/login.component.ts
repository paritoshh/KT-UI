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

  confirmCode: boolean = false;
  codeWasConfirmed: boolean = false;
  error: string = "";
  isErrorInVerifyEmail: boolean = false;
  verifyEmailErrorMessage: string;
  emailVerificationMessage: boolean = false;
  //New
  isLoginFormRequested = false;

  //register
  email : string;


  ngOnInit(): void {
  }
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
        },
        err => {
          this.isErrorInVerifyEmail = true;
          this.verifyEmailErrorMessage = err.message;
          this.error = "Confirm Authorization Error has occurred1111";

        }
      );
  }

  activateAccount() {
    this.confirmCode = true;
  }
  validateAuthCode(form: NgForm) {
    const code = form.value.code;
    const email = form.value.email;

    this.auth.confirmAuthCodeLater(code, email).subscribe(
      (data) => {
        this.codeWasConfirmed = true;
        this.confirmCode = false;
      },
      (err) => {
        console.log(err);
        this.isErrorInVerifyEmail = true;
        this.verifyEmailErrorMessage = err.message;
        //when user will click on cross button of error message, verify account section will be opened.
        this.confirmCode = true;
        this.error = "Confirm Authorization Error has occurred";
      });
  }
  closeErrorMessage() {
    this.isErrorInVerifyEmail = false;
  }

  loginAndRegisterFormToggle(){
    this.isLoginFormRequested = !this.isLoginFormRequested;
  }

  //Regiter part
  register(form: NgForm) {
    const email = form.value.email;
    this.email = email;
    const name = form.value.name;
    const password = form.value.password;
    this.auth.register(email, name, password).subscribe(
      (data) => {        
        this.confirmCode = true;
        form.reset();
      },
      (err) => {
        console.log(err);
        this.isErrorInVerifyEmail = true;
        this.verifyEmailErrorMessage = err.message;
        this.error = "Registration Error has occurred";
      }
    );
  }
}