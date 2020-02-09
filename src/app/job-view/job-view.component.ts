import { Component, OnInit } from '@angular/core';
import { JobService, BUSINESS_TYPE, PAYMENT_METHODS,EXNER_STAUS, JOB_TYPE } from '../job.service';
import { ConfigService } from '../config.service';
import { formatDate } from '../utility'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.css']
})
export class JobViewComponent implements OnInit {
  jobs = [];
  users = [];
  jobTypes = JOB_TYPE;
  is_loading = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['selected','created_date','company_name','job_type',
  'assignee','contact_fullname','is_paid'];
  formatDate = formatDate;

  constructor(
    private job_service: JobService,
    private router: Router,
    private config_service: ConfigService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  onAdd() {
    this.router.navigate(['/jobs/add']);
  }

  getUsers() {
    this.is_loading = true;
    this.config_service.getUsers({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        arr.forEach(item=>{
          item['display_name'] = item['first_name'] + item['last_name'];
        });
        this.users = [...arr];
        this.getJobs();
      }
    });
  }

  getJobs() {
    this.job_service.getJobs({}).subscribe(data=>{
      if(data){
        this.jobs = [...data];
        this.is_loading = false;
      }
    });
  }

  getJobType(type) {
    let res = this.jobTypes.find(item =>  item.id === parseInt(type));
    if(!res)
      return '';

    return res['label'];
  }

  findUserName(customer:object) {
    if(!customer)
      return '';

    let u = this.users.find(u => u.id === customer['assignee']);
    if(!u)
      return '';
    return u['display_name'];
  }

  findBusinessType(type_id) {
    let res = BUSINESS_TYPE.find(t=>t.id === type_id);
    if(!res)
      return '';
    return res['label'];
  }

  displayWayOfPayment(customer) {
    if(!customer)
      return '';

    let res = PAYMENT_METHODS.find(t=>t.id === customer['way_of_payment']);
    if(!res)
      return '';
    return res['label'];
  }

  displayPaymentDate(customer) {
    if(!customer['payment_date'])
      return '';

    return formatDate(customer['payment_date']);
  }

  displayCompanyField(company, field) {
    let name = '';
    if(!company)
      return '';

    for(let key of Object.keys(company)) {
      if(key === field) {
        return company[key];
      }
    }
    return name;
  }


  externalTaskStatus(id) {
    let res = EXNER_STAUS.find(t=>t.id === id);
    if(!res)
      return '';
    return res['label']; 
  }

}
