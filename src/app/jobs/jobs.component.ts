import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerComponent } from '../customer/customer.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  selectedJob = {};
  customers = {};
  customer_control = {};
  files = [];
  isEdit = true;
 

  constructor() { }

  @ViewChild(CustomerComponent, {static: false})
  set appBacon(directive: CustomerComponent) {
    this.customer_control = directive.customer;
    this.files = directive.files;
  };

  ngOnInit() {
  }

  onSave() {
    let c = this.customer_control['company_name'].value;
    let t = 0;
  }

  onCancel() {

  }

}
