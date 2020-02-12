import { Directive, Component, OnInit, Output, Input, EventEmitter, HostBinding, HostListener,ViewChild  } from '@angular/core';
import { ConfigService,FILE_URL } from '../config.service';
import { FormControl } from '@angular/forms';
import { JobService, JOB_TYPE, PAYMENT_METHODS, 
  TAXPAYER_TYPE, TAX_TYPE, BUSINESS_TYPE } from '../job.service';
import { LeadService } from '../lead.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { formatDate,formatDate_Date } from '../utility'

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit {
  _users=[];
  customer = {};
  jobControl = {};
  selectedCustomer = {};
  selectedJob = {};
  jobTypes = JOB_TYPE;
  paymentMethods = PAYMENT_METHODS;
  taxpayer_type = TAXPAYER_TYPE;
  tax_type = TAX_TYPE;
  business_type = BUSINESS_TYPE;
  lead_source = [];
  files: any = [];
  is_paid = 0;
  file_url = FILE_URL;
  paids  = [{v: 0,label:'未交费'}, {v:1, label:'已交费'}];
  _formatDate = formatDate;
  //@Input('job') job: Object;
  @Input('isEdit') isEdit: boolean;

  constructor(
    private config_service: ConfigService,
    private lead_service: LeadService,
    private job_service: JobService,
  ) {
    this.customer = {};
    this.customer['company_name'] = new FormControl();
    this.customer['contact_fullname'] = new FormControl();
    this.customer['assignee'] = new FormControl();
    this.customer['contact_cell_phone'] = new FormControl();
    this.customer['contact_work_phone'] = new FormControl();
    this.customer['customer_email'] = new FormControl();
    this.customer['wechat_id'] = new FormControl();
    this.customer['city'] = new FormControl();
    this.customer['payment_amount'] = new FormControl();
    this.customer['way_of_payment'] = new FormControl();
    this.customer['cost'] = new FormControl();
    this.customer['registered_address'] = new FormControl();
    this.customer['legal_fullname'] = new FormControl();
    this.customer['lead_source'] = new FormControl();
    this.customer['doc_location'] = new FormControl();
    this.customer['taxpayer_type'] = new FormControl();
    this.customer['tax_type'] = new FormControl();
    this.customer['business_type'] = new FormControl();
    this.customer['remarks'] = new FormControl();
    this.customer['is_paid'] = 0;
    this.customer['files'] = this.files;

    this.jobControl = {};
    this.jobControl['type'] = new FormControl();
    
   }

  ngOnInit() {
    this.getUsers();
  }

  @Input('job')
  set job(val: any) {
    if(val && val['customer']) {
      this.selectedCustomer = val['customer'][0];
      this.selectedJob = val;

      if(!this.selectedCustomer)
        return;
        
      if(this.selectedCustomer['id'])
        this.customer['id'] = this.selectedCustomer['id'];

      this.customer['company_name'].value = this.selectedCustomer['company_name'] || '';
      this.customer['contact_fullname'].value = this.selectedCustomer['contact_fullname'] || '';
      this.customer['assignee'].value = this.selectedCustomer['assignee'];
      this.customer['contact_cell_phone'].value = this.selectedCustomer['cell_phone'];
      this.customer['contact_work_phone'].value = this.selectedCustomer['work_phone'];
      this.customer['customer_email'].value = this.selectedCustomer['customer_email'];
      this.customer['wechat_id'].value = this.selectedCustomer['wechat_id'];
      this.customer['city'].value = this.selectedCustomer['city'];
      this.customer['payment_amount'].value = this.selectedCustomer['payment_amount'];
      this.customer['way_of_payment'].value = this.selectedCustomer['way_of_payment'];
      this.customer['cost'].value = this.selectedCustomer['cost'];
      this.customer['registered_address'].value = this.selectedCustomer['registered_address'];
      this.customer['legal_fullname'].value = this.selectedCustomer['legal_fullname'];
      this.customer['lead_source'].value = this.selectedCustomer['lead_source'];
      this.customer['doc_location'].value = this.selectedCustomer['doc_location'];
      this.customer['taxpayer_type'].value = this.selectedCustomer['taxpayer_type'];
      this.customer['tax_type'].value = this.selectedCustomer['tax_type'];
      this.customer['business_type'].value = this.selectedCustomer['business_type'];
      this.customer['remarks'].value = this.selectedCustomer['remarks'];
      this.customer['is_paid'] = this.selectedCustomer['is_paid'];
      this.customer['files'] = this.selectedCustomer['files']?this.selectedCustomer['files'].map(item=>item.file_path):[];
    }
  }

  @Input('users')
  set users(val: any) {
    if(val)
      this._users = val;
  }

  getUsers() {
    if(this._users.length==0)
      this.config_service.getUsers({}).subscribe(data=>{
        if(data){
          this._users = [...data['results']];
          this.getLeadSource();
        }
      });
  }


  findUserName(user_id) {
    if(!this._users)
      return '';

    let u = this._users.find(u => u.id === user_id);
    if(!u)
      return '';
    return `${u['first_name']} ${u['last_name']}`;
  }

  getPaid(is_paid) {
    return is_paid===1?'是':'否';
  }

  getTaxPayerType(type) {
    let res = this.taxpayer_type.find(item =>  item.id === parseInt(type));
    if(!res)
      return '';

    return res['label'];
  }

  getTaxType(type) {
    let res = this.tax_type.find(item =>  item.id === parseInt(type));
    if(!res)
      return '';

    return res['label'];
  }

  getBusinessType(type) {
    let res = this.business_type.find(item =>  item.id === parseInt(type));
    if(!res)
      return '';

    return res['label'];
  }

  getJobType(type) {
    let res = this.jobTypes.find(item =>  item.id === parseInt(type));
    if(!res)
      return '';

    return res['label'];
  }

  getLeadSource() {
    if(this.lead_source.length==0)
      this.lead_service.getSource({}).subscribe(data=>{
        if(data){
          this.lead_source = [...data['results']];
        }
      });
  }

  onFileDropped(files) {
    //this.files = [...files];
    this.customer['files'] = [...files];
  }

  onSave() {
    const customer = {};
    if(this.customer['company_name'].errors || this.customer['contact_fullname'].errors || this.customer['contact_cell_phone'].errors || this.customer['city'].errors)
    return;
  }

}
