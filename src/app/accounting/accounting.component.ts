import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent implements OnInit {
  is_loading = false;
  displayedColumns: string[] = [];

  constructor() { }

  ngOnInit() {
  }

}
