import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../shared/authorization.service';

//date
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  confirmCode: boolean = false;
  codeWasConfirmed: boolean = false;
  isErrorInEmailRegisterFlow: boolean = false;
  loginRegisterFlowErrorMessage: string;
  isErrorInValidateAuthCodeLaterFlow: boolean = false;
  validateAuthCodeLaterFlowErrorMessage: string;

  //New
  isLoginFormRequested = false;

  //register
  email: string;

  //date
  selectedDate: any;

  //Date
  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required])
  })


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
          this.isErrorInEmailRegisterFlow = true;
          this.loginRegisterFlowErrorMessage = err.message;

        }
      );
  }

  activateAccount() {
    this.confirmCode = true;
  }

  validateAuthCode(form: NgForm) {
    const code = form.value.code;

    this.auth.confirmAuthCode(code).subscribe(
      (data) => {
        this.codeWasConfirmed = true;
        this.confirmCode = false;
        alert('Verification success.');
      },
      (err) => {
        console.log(err);
        this.loginRegisterFlowErrorMessage = err.message;
        this.isErrorInEmailRegisterFlow = true;
      });
  }

  validateAuthCodeLater(form: NgForm) {
    const code = form.value.code;
    const email = form.value.email;
    this.auth.confirmAuthCodeLater(code, email).subscribe(
      (data) => {
        this.codeWasConfirmed = true;
        this.confirmCode = false;
        this.closebutton.nativeElement.click();
      },
      (err) => {
        console.log(err);
        this.isErrorInValidateAuthCodeLaterFlow = true;
        this.validateAuthCodeLaterFlowErrorMessage = err.message;
      });
  }
  loginAndRegisterFormToggle() {
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
        this.isErrorInEmailRegisterFlow = true;
        this.loginRegisterFlowErrorMessage = err.message;
      }
    );
  }
}