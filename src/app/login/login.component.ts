import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ConfigService } from '../config.service';
import {ErrorStateMatcher} from '@angular/material/core';


/** Error when invalid control is dirty, touched, or submitted. */
export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: string;
  password: string;
  submitted = false;
  @Output() isAuth = new EventEmitter<boolean>();

  usernameFormControl = new FormControl('', [
    Validators.required,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new LoginErrorStateMatcher();

  constructor(
    private service: ConfigService,
    private formBuilder: FormBuilder,
  ) { 
    
    
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    let username = this.usernameFormControl.value;
    let password = this.passwordFormControl.value;
    if(!username || !password)
      return;

    this.service.login(username,password).subscribe(data=>{
      console.log(data);
      if(data.response === 'success'){
        this.isAuth.emit(true);
        //this.r.navigate([''], {queryParams:{'page':1,'view':'grid'}});
      }
      else
        this.isAuth.emit(false);
    },
    error=>{
      console.log(error);
      this.isAuth.emit(false);
    });
  }

}
