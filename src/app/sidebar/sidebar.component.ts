import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoginComponent } from '../login/login.component';
import { ConfigService }  from '../config.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  opened: Boolean;
  isAuth: Boolean;
  currentUser: Object;
  isMinScreen: Boolean;

  constructor(
    private service: ConfigService,
    private router: Router,
  ) { 
    this.isAuth = false;
    this.isMinScreen = false;
  }

  ngOnInit() {
    if(this.service.currentUserValue){
      this.isAuth = true;
      this.currentUser = this.service.currentUserValue;
    }
    else{
      this.isAuth = false;
      this.router.navigate(['/login']);
    }

    this.service.change.subscribe(data => {
      if(data){
        this.isAuth = true;
        this.currentUser = {...data};
      }
    });

  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.currentUser = {};
    this.service.logout();
    this.isAuth = false;
    this.router.navigate(['/login']);
  }

}
