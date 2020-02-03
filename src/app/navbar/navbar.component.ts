import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ConfigService }  from '../config.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logo: string;
  open; boolean;
  title = 'app';
  isAuth: boolean;
  currentUser: Object;

  @Output() toggle = new EventEmitter<boolean>();
  constructor(
    private service: ConfigService,
    private router: Router,
  ) {
    this.logo = '';
    this.open = false;
   }

  ngOnInit() {
    if(this.service.currentUserValue){
      this.isAuth = true;
    }
    else{
      this.isAuth = false;
    }

    this.service.change.subscribe(data => {
      if(data){
        this.isAuth = true;
        this.currentUser = {...data};
      }
    });
  }

  getUserDisplayName(user) {
    if(!user)
      return '';
    return `${user.first_name} ${user.last_name}`;
  }

  onToggleBar () {
    this.open = !this.open;
    this.toggle.emit(this.open);
  }

  login() {

  }

  logout() {
    this.currentUser = {};
    this.service.logout();
    this.isAuth = false;
    this.router.navigate(['/']);
  }

}
