import { Directive, Component, OnInit, Output, Input, EventEmitter, HostBinding, HostListener  } from '@angular/core';
import { ConfigService } from '../config.service';
import { FormControl } from '@angular/forms';
import { JobService, JOB_TYPE, PAYMENT_METHODS, 
  TAXPAYER_TYPE, TAX_TYPE, BUSINESS_TYPE } from '../job.service';
import { LeadService } from '../lead.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  users=[];
  customer = {};
  jobControl = {};
  selectedCustomer = {};
  jobTypes = JOB_TYPE;
  paymentMethods = PAYMENT_METHODS;
  taxpayer_type = TAXPAYER_TYPE;
  tax_type = TAX_TYPE;
  business_type = BUSINESS_TYPE;
  lead_source = [];
  files: any = [];
  is_paid = 0;
  paids  = [{v: 0,label:'未交费'}, {v:1, label:'已交费'}];
  @Input('job') job: Object;
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


  getUsers() {
    if(this.users.length==0)
      this.config_service.getUsers({}).subscribe(data=>{
        if(data){
          this.users = [...data['results']];
          this.getLeadSource();
        }
      });
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
    this.files = [...files];
    this.customer['files'] = this.files;
  }

  onSave() {
    const customer = {};
    if(this.customer['company_name'].errors || this.customer['contact_fullname'].errors || this.customer['contact_cell_phone'].errors || this.customer['city'].errors)
    return;

    



  }

}
