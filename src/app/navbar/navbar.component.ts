import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logo: string;
  open; boolean;

  @Output() toggle = new EventEmitter<boolean>();

  constructor() {
    this.logo = '';
    this.open = false;
   }

  ngOnInit() {
  }

  onToggleBar () {
    this.open = !this.open;
    this.toggle.emit(this.open);
  }

  login() {

  }

  logout() {

  }

}
