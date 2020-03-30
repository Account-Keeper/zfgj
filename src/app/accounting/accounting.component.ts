import {
  Directive, Component, OnInit, Output, Inject, OnDestroy,
  Input, EventEmitter, HostBinding, HostListener,
  ViewChild, SimpleChange, SimpleChanges
} from '@angular/core';
import { ConfigService, FILE_URL } from '../config.service';
import { FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  JobService, JOB_TYPE, PAYMENT_METHODS,
  TAXPAYER_TYPE, TAX_TYPE, BUSINESS_TYPE
} from '../job.service';
import { LeadService } from '../lead.service';
import { FileService } from '../file.service';
import { formatDate, formatDate_Date, currencyFormat } from '../utility'
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { delay, share } from 'rxjs/operators';

export interface DialogData {
  customer: object;
}


const getTaxPayerType = (type) => {
  const t = TAXPAYER_TYPE.find(item => item.id === type);
  return t ? t.label : '';
}

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent implements OnInit, OnDestroy {
  is_loading = false;
  pageSize = 0;
  length = 0;
  filter = {};
  data = [];
  users = [];
  Pagelength = 0;
  _formatDate = formatDate;
  pageEvent: PageEvent;
  pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = ['id', 'company_name', 'type', 'accounting_fullname', 'renew_to'];
  taxPayerType = TAXPAYER_TYPE;

  constructor(
    private job_service: JobService,
    private config_service: ConfigService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.is_loading = true;

    forkJoin([
      this.config_service.getUsers({}),
      this.job_service.getKeepings({})
    ]).subscribe(data => {
      this.users = [...data[0]['results']];
      const accounting = [...data[1]['results']];
      for (let d of accounting) {
        if (d.customer.length > 0) {
          d['customer'] = d.customer[0];
          d['type_name'] = this.getTaxPayerType(d.type);
          for (let p of d.payments) {
            p.renew_from = formatDate(p.renew_from);
            p.renew_to = formatDate(p.renew_to);
          }
        }
      }
      this.data = accounting;
      this.is_loading = false;
    });
  }

  getUsers() {
    if (this.users.length == 0)
      this.config_service.getUsers({}).subscribe(data => {
        if (data) {
          this.users = [...data['results']];
        }
      });
  }

  onLoadData() {
    let filter = {};
    this.job_service.getKeepings(filter).subscribe(data => {
      if (data) {
        let accounting = [...data['results']];
        for (let d of accounting) {
          if (d.customer.length > 0) {
            d['customer'] = d.customer[0];
            d['type_name'] = this.getTaxPayerType(d.type);
            for (let p of d.payments) {
              p.renew_from = formatDate(p.renew_from);
              p.renew_to = formatDate(p.renew_to);
            }
          }
        }
        this.data = [...accounting];
      }
    });
  }

  getRenewTo(payments) {
    if(payments && payments.length>0) {
      return payments[0].renew_to;
    }
    return;
  }

  isExpired(date) {
    if(!date)
      return false;

    let today = new Date();
    let pay_date = new Date(date);
    return pay_date<today;
  }

  getTaxPayerType(type) {
    const t = this.taxPayerType.find(item => item.id === type);
    return t ? t.label : '';
  }

  onPaging(event) {

  }

  onAdd() {
    const dialogRef = this.dialog.open(AccountingDialogComponent, {
      width: '80%',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onLoadData();
    });
  }

  openDialog(id) {
    const dialogRef = this.dialog.open(AccountingDialogComponent, {
      width: '80%',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onLoadData();
    });
  }

  ngOnDestroy() {
    this.data = [];
  }

}

//dialog
@Component({
  selector: 'accounting-dialog',
  templateUrl: './accounting-dialog.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingDialogComponent {
  is_adding = false;
  is_duplicated = false;
  account = {};
  customer: Object;
  customers = [];
  payments = [];
  accountings = [];
  payment = {};
  taxPayerType = TAXPAYER_TYPE;
  _currencyFormat = currencyFormat;
  searchTxt = new FormControl;
  searchResults = [];
  @Output() onClose= new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<AccountingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Object,
    private job_service: JobService,
    private config_service: ConfigService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadData();
    this.onLoadData();
  }

  loadData() {
    if (this.data && this.data['id']) {
      const id = this.data['id'];
      this.job_service.getKeeping(id).subscribe(data => {
        if (data)
          this.account = { ...data['results'][0] };
        if (this.account['customer'])
          this.customer = { ...this.account['customer'][0] };

        this.account['type_name'] = getTaxPayerType(this.account['type']);
        for (let p of this.account['payments']) {
          p.renew_from = formatDate(p.renew_from);
          p.renew_to = formatDate(p.renew_to);
        }
      });
    }
    else {
      if (this.customers.length === 0) {
        this.job_service.getCustomers({}).subscribe(data => {
          this.customers = [...data['results']];
        });
      }
    }
  }

  initForm() {
    this.payment['renew_from'] = new FormControl();
    this.payment['bonus'] = new FormControl();
    this.payment['payment_amount'] = new FormControl();
  }

  loadCustomer(id) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOpenAddPayments() {
    this.is_adding = true;
  }

  onSearch() {
    let txt = this.searchTxt.value;
    this.searchResults = this.customers.filter(item => {
      let line = `${item.company_name} ${item.contact_fullname} ${item.cell_phone} ${item.work_phone} ${item.customer_email}`;
      if (line.indexOf(txt) > -1 && !this.hasCustomer(item.id))
        return true;

      return false;
    });
  }

  onAddCustomer(id) {
    if (id) {
      const keeping = {};
      keeping['customer_id'] = id;
      keeping['type'] = 0;
      this.is_duplicated = false;

      if(this.hasCustomer(id)) {
        this.is_duplicated = true;
      }

      this.job_service.addKeepingCustomer(keeping).subscribe(data => {
        if (data) {
          let id = data['results'][0];
          this.data = new Object();
          this.data['id'] = id;
          this.loadData();
        }
      })
    }
  }

  onAddPayments() {
    this.is_adding = false;
    const p = {};
    p['renew_from'] = formatDate(this.payment['renew_from'].value);
    const bonus = this.payment['bonus'].value || 0;
    let date = new Date(this.payment['renew_from'].value);
    let m = date.getMonth();
    let date_to = new Date(date.setMonth(date.getMonth() + 12 + bonus));
    p['renew_to'] = formatDate(date_to);
    p['payment_amount'] = this.payment['payment_amount'].value;

    this.job_service.addPayment(this.data['id'], p).subscribe(date => {
      this.initForm();
      this.loadData();
    });
  }

  ngOnDestroy() {
    //this.customers = [];
  }

  hasCustomer(id):boolean {
    let res = this.accountings.find(item => {
      if(!item['customer'])
        return false;

      return item['customer']['id'] === id;
    })
    return res?true:false;
  }

  onLoadData() {
    let filter = {};
    this.job_service.getKeepings(filter).subscribe(data => {
      if (data) {
        let accounting = [...data['results']];
        for (let d of accounting) {
          if (d.customer.length > 0) {
            d['customer'] = d.customer[0];
          }
        }
        this.accountings = [...accounting];
      }
    });
  }

  onCloseDialog() {
    this.onClose.emit(true);
  }
}
