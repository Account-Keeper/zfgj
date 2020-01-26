import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerComponent } from '../customer/customer.component';
import { InternalWorkComponent } from '../internal-work/internal-work.component';
import { ExternalWorkComponent } from '../external-work/external-work.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  selectedJob = {};
  customers = {};
  customer_control = {};
  internal_control = {};
  customer = {};
  job_control = {};
  files = [];
  isEdit = true;
  

  constructor() { }

  @ViewChild(CustomerComponent, {static: false})
  set appBacon(directive: CustomerComponent) {
    this.customer_control = directive.customer;
    this.job_control = directive.jobControl;
  };

  @ViewChild(InternalWorkComponent, {static: false})
  set appBacon2(directive: InternalWorkComponent) {
    this.internal_control = directive.internal
  };

  @ViewChild(ExternalWorkComponent, {static: false})
  set appBacon3(directive: ExternalWorkComponent) {
   
  };

  ngOnInit() {
    
  }

  onSave() {
    const job = {};
    job['type'] = this.job_control['type'].value;
    job['company_name'] = this.customer_control['company_name'].value;
    let t = 0;
  }

  onCancel() {

  }

}
