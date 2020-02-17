import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import { JobService, BUSINESS_TYPE, PAYMENT_METHODS,EXNER_STAUS, JOB_TYPE } from '../job.service';
import { ConfigService } from '../config.service';
import { formatDate,formatDate_Date } from '../utility'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.css']
})
export class JobViewComponent implements OnInit {
  jobs = [];
  pagedJobs = [];
  users = [];
  filter = {};
  sortingControl = new FormControl();
  jobTypes = JOB_TYPE;
  is_loading = false;
  displayedColumns: string[] = ['selected','id','created_date','company_name','job_type',
  'assignee','contact_fullname','is_paid'];
  formatDate = formatDate;
  _formatDate_Date = formatDate_Date;
  length = 100;
  pageSize = 25;
  page = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  sortingOptions: any;

  constructor(
    private job_service: JobService,
    private routerRoute: ActivatedRoute,
    private router: Router,
    private config_service: ConfigService
  ) {
    routerRoute.queryParams.subscribe(
      params => {
        this.page = params['page']?parseInt(params['page']) : 0;
        this.pageSize = params['page_size']?parseInt(params['page_size']) : 25;
      }
    );
    this.sortingOptions = [
      {id:0,field:'created_date',label:'创建时间 ↓',order:'desc'},
      {id:1,field:'created_date',label:'创建时间 ↑',order:'asc'},
    ];
    this.sortingControl.setValue(0);
    this.initFilter();
    this.getUsers();
   }

  ngOnInit() {
    
  }

  initFilter() {
    this.filter = {};
    this.filter['created_date'] = new FormControl();
    this.filter['company_name'] = new FormControl();
    this.filter['job_type'] = new FormControl();
    this.filter['assignee'] = new FormControl();
    this.filter['is_paid'] = new FormControl();
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
    let sort_by = {};
    let res = this.sortingOptions.find(item=>item.id === this.sortingControl.value);
    if(res) {
      sort_by = {sort_by: res.field, order: res.order};
    }
    
    this.job_service.getJobs({...sort_by}).subscribe(data=>{
      if(data){
        this.jobs = [...data];
        this.pagedJobs = this.jobs.slice(this.page, this.page+this.pageSize);
        this.length = this.jobs.length;
        this.is_loading = false;
      }
    });
  }

  onSorting() {
    this.getJobs();
  }

  getJobType(type) {
    let res = this.jobTypes.find(item =>  item['id'] === parseInt(type));
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

  onPaging(event) {
    this.pagedJobs = this.jobs.slice(event.pageIndex, this.page+event.pageSize);
    this.router.navigate(['/jobs/list'], { queryParams: { 'page': event.pageIndex, 'page_size': event.pageSize } });
  }

  externalTaskStatus(id) {
    let res = EXNER_STAUS.find(t=>t.id === id);
    if(!res)
      return '';
    return res['label']; 
  }

  onClearSearch() {
    this.initFilter();
    this.router.navigate(['/jobs/list'], { queryParams: { 'page': this.page, 'page_size': this.pageSize } });
  }

  onSearch(){
    let list = [];

      list = this.jobs.filter(item => {
        let customer = item['customer']?item['customer'][0] : null;

        if(this.filter['created_date'].value) {
          let date = this._formatDate_Date(this.filter['created_date'].value);
          let f = this.formatDate(item['created_date']);
          if(date !== f)
            return false;
        }

        if(this.filter['company_name'].value && customer) {
          if( customer['company_name'] !== this.filter['company_name'].value)
            return false;
        }

        if(this.filter['job_type'].value !== null) {
          if(item['type'] != this.filter['job_type'].value) 
            return false;
        }

        if(this.filter['assignee'].value && customer) {
          if(this.filter['assignee'].value!=null && parseInt(customer['assignee']) !== parseInt(this.filter['assignee'].value))
            return false;
        }

        if(this.filter['is_paid'].value!==null && customer) {
          if(this.filter['is_paid'].value!==null && parseInt(customer['is_paid']) !== parseInt(this.filter['is_paid'].value))
            return false;
        }
        return true;
      });

 

    this.pagedJobs = [...list];
  }

}
