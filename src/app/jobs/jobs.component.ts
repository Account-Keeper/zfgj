import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerComponent } from '../customer/customer.component';
import { InternalWorkComponent } from '../internal-work/internal-work.component';
import { ExternalWorkComponent } from '../external-work/external-work.component';
import { ConfigService } from '../config.service';
import { JobService, JOB_TYPE } from '../job.service';
import { ActivatedRoute, Router,Event,NavigationStart,NavigationEnd,NavigationError } from '@angular/router';
import { simplifyDatetime, formatDate, formatDatetimeLocal } from '../utility';

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
  jobTypes = JOB_TYPE;
  selected_job_id: any;
  formatDate= formatDate;
  users = [];

  constructor(
    private router: Router,
    private routerRoute: ActivatedRoute,
    private job_service: JobService,
    private config_service: ConfigService
  ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   }
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
  });


    routerRoute.paramMap.subscribe(
      params => {
        this.selected_job_id = params.get('id');
        this.getUsers();

        if(!this.selected_job_id) {
          this.isEdit = true;
          this.selectedJob = {};
        }
      }
    );
  }

  @ViewChild(CustomerComponent, {static: false})
  set appBacon(directive: CustomerComponent) {
    this.customer_control = directive.customer;
    this.job_control = directive.jobControl;
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
    
  }

  getJob(id) {
    this.job_service.getJob(id).subscribe(data=>{
      if(data){
        this.selectedJob = data[0];
      }
    });
  }


  getUsers() {
    this.config_service.getUsers({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        arr.forEach(item=>{
          item['display_name'] = item['first_name'] + item['last_name'];
        });
        this.users = [...arr];
        if(this.selected_job_id)
          this.getJob(parseInt(this.selected_job_id));
      }
    });
  }

  onSave() {
    const job = {};
    if(this.selected_job_id)
      job['id'] = this.selected_job_id;

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
    customer['customer_email'] = this.customer_control['customer_email'].value;
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
        this.isEdit = false;
        let id = data['results'][0]['id'];
        this.router.navigate([`/jobs/list`]);
      }
    });


  }

  onEdit() {
    this.isEdit = true;
  }

  onCancel() {
    this.isEdit = false;
  }

}
