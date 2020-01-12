import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-keeping-renew',
  templateUrl: './keeping-renew.component.html',
  styleUrls: ['./keeping-renew.component.css']
})
export class KeepingRenewComponent implements OnInit {
  data = {};
  constructor() { }

  ngOnInit() {
    this.data = {};
    this.data['irs'] = new FormControl();
    this.data['company_name'] = new FormControl();
    this.data['customer_level'] = new FormControl();
    this.data['has_account'] = new FormControl();
    this.data['tax_code'] = new FormControl();
    this.data['yzt_password'] = new FormControl();
    this.data['personal_tax_password'] = new FormControl();
    this.data['company_created_date'] = new FormControl();
    this.data['keeping_created_date'] = new FormControl();
  }



}
