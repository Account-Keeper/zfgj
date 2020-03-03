import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ConfigService} from './config.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';
  currentUser: object;
  isAuth: boolean;

  constructor(
    private router: Router,
    private service: ConfigService,
  ){
    this.isAuth = false;
    this.currentUser = {username:''};
  }

  ngOnInit() {
    if(this.service.currentUserValue){
      this.isAuth = true;
    }
  }

  onLoginOut() {
    this.service.logout();
    this.isAuth = false;
    window.location.reload();
  }

}
