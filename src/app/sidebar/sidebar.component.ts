import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  opened: boolean;
  constructor() { }

  ngOnInit() {
  }

}
