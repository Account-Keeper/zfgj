import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isAuth: boolean;
  loginForm: FormGroup;

  constructor(
  ) { 
    this.isAuth = false;
    
    
  }

  ngOnInit() {
  }

  onSubmit() {

  }

}
