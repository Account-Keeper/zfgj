import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../config.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: string;
  password: string;
  @Output() isAuth = new EventEmitter<boolean>();

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
    this.service.login(this.username,this.password).subscribe(data=>{
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
