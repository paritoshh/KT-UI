import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../shared/authorization.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  confirmCode: boolean = false;
  codeWasConfirmed: boolean = false;
  error: string = "";

  constructor(private auth: AuthorizationService,
    private _router: Router) { }

  ngOnInit(): void {
  }

  register(form: NgForm) {
    const email = form.value.email;
    const name = form.value.name;
    const password = form.value.password;
    this.auth.register(email, name, password).subscribe(
      (data) => {        
        this.confirmCode = true;
      },
      (err) => {
        console.log(err);
        this.error = "Registration Error has occurred";
      }
    );
  }
  validateAuthCode(form: NgForm) {
    const code = form.value.code;
    
    this.auth.confirmAuthCode(code).subscribe(
      (data) => {
        //this._router.navigateByUrl('/');
        this.codeWasConfirmed = true;
        this.confirmCode = false;
        this._router.navigate(['/home']);
      },
      (err) => {
        console.log(err);
        this.error = "Confirm Authorization Error has occurred";
      });
  }

}
