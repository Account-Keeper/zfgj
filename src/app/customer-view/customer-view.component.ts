import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConfigService, FILE_URL } from '../config.service';
import { FormControl } from '@angular/forms';
import {
  JobService, JOB_TYPE, PAYMENT_METHODS,
  TAXPAYER_TYPE, TAX_TYPE, BUSINESS_TYPE
} from '../job.service';
import { formatDate, formatDate_Date } from '../utility'
import { CustomerComponent } from '../customer/customer.component';
import { ActivatedRoute, Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  customers = [];
  selectedItem = {};
  selectedJob = {};
  selected_customer_id: number;
  users = [];
  is_loading = false;
  isEdit = false;
  isDetail = false;
  taxpayer_type = TAXPAYER_TYPE;
  tax_type = TAX_TYPE;
  business_type = BUSINESS_TYPE;
  _formatDate = formatDate;
  panelOpenState = false;
  customer_control = {};
  filter = {};
  Pagelength = 0;
  pageSize = 0;
  pageEvent: PageEvent;
  pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = ['selected', 'company_name', 'contact_fullname', 'sales_fullname',
    'accounting_fullname'];

  @ViewChild(CustomerComponent, { static: false })
  set appBacon(directive: CustomerComponent) {
    if (directive && directive.customer)
      this.customer_control = directive.customer;
  };

  constructor(
    private router: Router,
    private routerRoute: ActivatedRoute,
    private config_service: ConfigService,
    private job_service: JobService,
  ) {
    this.isDetail = false;

    this.filter['company_name'] = new FormControl();
    this.filter['sales_fullname'] = new FormControl();
    this.filter['accounting_fullname'] = new FormControl();

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }

    routerRoute.paramMap.subscribe(
      params => {
        this.selected_customer_id = parseInt(params.get('id'));

      }
    );

  }

  ngOnInit() {
    this.is_loading = true;
    forkJoin([
      this.config_service.getUsers({}),
      this.job_service.getCustomers({})
    ]).subscribe(data => {
      this.users = [...data[0]['results']];
      this.customers = [...data[1]['results']];
      this.Pagelength = data[1]['count'] || 0;
      this.is_loading = false;

      if (this.selected_customer_id && this.selected_customer_id>=0) {
        this.selectedItem = this.customers.find(item => item.id === this.selected_customer_id);
        this.selectedJob['customer'] = [];
        this.selectedJob['customer'].push(this.selectedItem);
        this.isDetail = true;
      }
      else if( this.selected_customer_id == -1) {
        this.selectedJob['customer'] = [{}];
        this.isDetail = true;
        this.isEdit = true;
      }

    });
  }

  findUserName(user_id) {
    if (!this.users)
      return '';

    let u = this.users.find(u => u.id === user_id);
    if (!u)
      return '';
    return `${u['first_name']} ${u['last_name']}`;
  }

  getPaid(is_paid) {
    return is_paid === 1 ? '是' : '否';
  }

  getTaxPayerType(type) {
    let res = this.taxpayer_type.find(item => item.id === parseInt(type));
    if (!res)
      return '';

    return res['label'];
  }

  getTaxType(type) {
    let res = this.tax_type.find(item => item.id === parseInt(type));
    if (!res)
      return '';

    return res['label'];
  }

  getBusinessType(type) {
    let res = this.business_type.find(item => item.id === parseInt(type));
    if (!res)
      return '';

    return res['label'];
  }

  onEdit() {
    this.isEdit = true;
  }

  onAdd() {
    this.router.navigate(['/customers/view/-1']);
  }

  onCancel() {
    this.isEdit = false;
  }

  onSearch() {
    const filter = {};
    filter['page_length'] = this.Pagelength;
    filter['page_size'] = this.pageSize;
    filter['page_index'] = 0;

    if(this.pageEvent){
      filter['page_length'] = this.pageEvent.length;
      filter['page_size'] = this.pageEvent.pageSize;
      filter['page_index'] = this.pageEvent.pageIndex;
    }

    if (this.filter['company_name'])
      filter['company_name'] = this.filter['company_name'].value;

    if (this.filter['sales_fullname'])
      filter['sales_fullname'] = this.filter['sales_fullname'].value;

    if (this.filter['accounting_fullname'])
      filter['accounting_fullname'] = this.filter['accounting_fullname'].value;

      
    this.job_service.getCustomers(filter).subscribe(data => {
      if (data) {
        this.customers = [...data['results']];
        this.Pagelength = data['count'] || 0;
      }
    });
  }

  onRefresh() {
    for (let key of Object.keys(this.filter)) {
      this.filter[key] = new FormControl;
    }

    this.job_service.getCustomers({}).subscribe(data => {
      if (data) {
        this.customers = [...data['results']];
        this.Pagelength = data['count'] || 0;
      }
    });

  }

  onSave() {
    let customer = {};
    if (this.customer_control['id'])
      customer['id'] = this.customer_control['id'];

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
    customer['office_address'] = this.customer_control['office_address'].value;
    customer['legal_fullname'] = this.customer_control['legal_fullname'].value;
    customer['lead_source'] = this.customer_control['lead_source'].value;
    customer['doc_location'] = this.customer_control['doc_location'].value;
    customer['taxpayer_type'] = this.customer_control['taxpayer_type'].value;
    customer['tax_type'] = this.customer_control['tax_type'].value;
    customer['business_type'] = this.customer_control['business_type'].value;
    customer['remarks'] = this.customer_control['remarks'].value;
    customer['tax_code'] = this.customer_control['tax_code'].value;
    customer['yzt_pwd'] = this.customer_control['yzt_pwd'].value;
    customer['personal_tax_pwd'] = this.customer_control['personal_tax_pwd'].value;
    customer['sales_fullname'] = this.customer_control['sales_fullname'].value;
    customer['accounting_fullname'] = this.customer_control['accounting_fullname'].value;
    customer['is_paid'] = this.customer_control['is_paid'];
    customer['files'] = this.customer_control['files'];

    this.job_service.saveCustomer(customer).subscribe(data => {
      if (data) {
        this.selectedItem = { ...data['results'][0] };
        this.Pagelength = data['count'] || 0;
        this.selectedJob = {};
        this.selectedJob['customer'] = [];
        this.selectedJob['customer'].push(this.selectedItem);
        this.router.navigate(['/customers/list']);
      }
    });
  }

  onPaging(event) {
    this.pageEvent = event;
    
    return event;
  }

}
