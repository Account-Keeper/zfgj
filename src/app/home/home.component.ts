import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ConfigService} from '../config.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private service: ConfigService,
    private router: Router,
  ) { }

  ngOnInit() {
    if(this.service.currentUserValue){
    }
    else{
      this.router.navigate(['/login']);
    }
  }

}
