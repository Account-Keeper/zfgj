import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ConfigService} from './config.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  currentUser: object;

  constructor(
    private router: Router,
    private service: ConfigService,
  ){
    this.currentUser = {username:''};
  }

  onLoginOut() {
    this.service.logout();
    this.router.navigate(['/login']);
  }

}
