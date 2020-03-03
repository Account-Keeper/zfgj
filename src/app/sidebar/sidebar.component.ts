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
    this.service.verifyToken().subscribe(data => {
      this.isAuth = data['result']?true: false;
      if(!this.isAuth || !this.service.currentUserValue){
        this.router.navigate(['/login']);
      }
      else{
        this.isAuth = true;
        this.currentUser = this.service.currentUserValue;
        this.service.change.subscribe(data => {
          if(data){
            this.isAuth = true;
            this.currentUser = {...data};
          }
        });
        
      }
    });
    /*
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
    */
  }

  login() {
    this.router.navigate(['']);
  }

  logout() {
    this.currentUser = {};
    this.service.logout();
    this.isAuth = false;
    window.location.reload();
  }

}
