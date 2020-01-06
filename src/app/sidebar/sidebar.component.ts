import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
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

  constructor(
    private service: ConfigService,
    private router: Router,
  ) { 
    this.isAuth = false;
  }

  ngOnInit() {
    if(this.service.currentUserValue){
      this.isAuth = true;
      this.router.navigate(['/home']);
    }
    else{
      this.isAuth = false;
      this.currentUser = this.service.currentUser;
      this.router.navigate(['/login']);
    }

    this.service.change.subscribe(user => {
      if(user){
        this.currentUser = {...user['result']};
        this.isAuth = true;
      }
    });

  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.service.logout();
    this.isAuth = false;
    this.router.navigate(['/login']);
  }

}
