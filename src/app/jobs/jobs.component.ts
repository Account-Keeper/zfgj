import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerComponent } from '../customer/customer.component';
import { InternalWorkComponent } from '../internal-work/internal-work.component';
import { ExternalWorkComponent } from '../external-work/external-work.component';
import { JobService } from '../job.service';

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
  external_control = {};
  customer = {};
  job_control = {};
  files = [];
  jobs = [];
  isEdit = false;
  isHidden = true;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['selected','company_name','contact_fullname'];

  constructor(
    private job_service: JobService
  ) { }

  @ViewChild(CustomerComponent, {static: false})
  set appBacon(directive: CustomerComponent) {
    this.customer_control = directive.customer;
  };

  @ViewChild(InternalWorkComponent, {static: false})
  set appBacon2(directive: InternalWorkComponent) {
    this.internal_control = directive.internal;
  };

  @ViewChild(ExternalWorkComponent, {static: false})
  set appBacon3(directive: ExternalWorkComponent) {
    this.external_control = directive.external;
  };

  ngOnInit() {
    this.getJobs();
  }

  getJobs() {
    this.job_service.getJobs({}).subscribe(data=>{
      if(data){
        this.jobs = [...data];
      }
    });
  }

  displayCompanyField(company, field) {
    let name = '';
    for(let key of Object.keys(company)) {
      if(key === field) {
        return company[key];
      }
    }
    return name;
  }

  onSave() {
    const job = {};
    job['type'] = this.job_control['type'].value;
    if(this.internal_control['assignee'].errors)
      return;

    if(this.customer_control['company_name'].errors 
    || this.customer_control['contact_fullname'].errors 
    || this.customer_control['contact_cell_phone'].errors
    || this.customer_control['city'].errors) 
      return;

    let customer = {};
    customer['company_name'] = this.customer_control['company_name'].value;
    customer['contact_fullname'] = this.customer_control['contact_fullname'].value;
    customer['assignee'] = this.customer_control['assignee'].value;
    customer['cell_phone'] = this.customer_control['contact_cell_phone'].value;
    customer['work_phone'] = this.customer_control['contact_work_phone'].value;
    customer['wechat_id'] = this.customer_control['wechat_id'].value;
    customer['city'] = this.customer_control['city'].value;
    customer['payment_amount'] = this.customer_control['payment_amount'].value;
    customer['way_of_payment'] = this.customer_control['way_of_payment'].value;
    customer['cost'] = this.customer_control['cost'].value;
    customer['registered_address'] = this.customer_control['registered_address'].value;
    customer['legal_fullname'] = this.customer_control['legal_fullname'].value;
    customer['lead_source'] = this.customer_control['lead_source'].value;
    customer['doc_location'] = this.customer_control['doc_location'].value;
    customer['taxpayer_type'] = this.customer_control['taxpayer_type'].value;
    customer['tax_type'] = this.customer_control['tax_type'].value;
    customer['business_type'] = this.customer_control['business_type'].value;
    customer['remarks'] = this.customer_control['remarks'].value;
    customer['is_paid'] = this.customer_control['is_paid'];
    customer['files'] = this.customer_control['files'];
    job['customer'] = customer;

    const internal_task = {};
    internal_task['created_date'] = this.internal_control['created_date'].value;
    internal_task['net_register_status'] = this.internal_control['net_register_status'].value;
    internal_task['net_register_date'] = this.internal_control['net_register_date'].value;
    internal_task['appointment_date'] = this.internal_control['appointment_date'].value;
    internal_task['assignee'] = this.internal_control['assignee'].value;
    internal_task['remarks'] = this.internal_control['remarks'].value;
    internal_task['external_assignee'] = this.internal_control['external_assignee'].value;
    internal_task['files'] = this.internal_control['files'];
    job['internal_task'] = internal_task;

    const external = {};
    external['status'] =this.external_control['status'].value;
    external['remarks'] =this.external_control['remarks'].value;
    external['files'] =this.external_control['files'] = [];
    job['external_task'] = external;

    this.job_service.saveJob(job).subscribe(data=>{
      if(data){
        console.log(">>");
      }
    });


  }

  onCancel() {

  }

}
