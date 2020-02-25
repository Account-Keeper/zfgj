import {
  Directive, Component, OnInit, Output,Inject,
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
import { formatDate, formatDate_Date } from '../utility'
import { PageEvent } from '@angular/material/paginator';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  customer: object;
}


@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent implements OnInit {
  is_loading = false;
  pageSize = 0;
  length = 0;
  filter = {};
  data = [];
  users = [];
  Pagelength = 0;
  pageEvent: PageEvent;
  pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = ['id', 'company_name', 'type', 'accounting_fullname', 'renew_to'];
  taxPayerType= TAXPAYER_TYPE;

  constructor(
    private job_service: JobService,
    private config_service: ConfigService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.is_loading = true;
    forkJoin([
      this.config_service.getUsers({}),
      this.job_service.getKeeping({})
    ]).subscribe(data => {
      this.users = [...data[0]['results']];
      const accounting = [...data[1]['results']];
      for(let d of accounting) {
        if(d.customer.length > 0) {
          d['customer'] = d.customer[0];
          d['type_name'] = this.getTaxPayerType(d.type);
          for(let p of d.payments) {
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
    if(this.users.length==0)
      this.config_service.getUsers({}).subscribe(data=>{
        if(data){
          this.users = [...data['results']];
        }
      });
  }

  onLoadData() {
    let filter = {};
    filter = this.filter;
    this.job_service.getKeeping(filter).subscribe(data => {
      if(data) {
        this.data = [...data['results']];
      }
    });
  }

  getTaxPayerType(type) {
    const t = this.taxPayerType.find(item => item.id === type);
    return t?t.label : '';
  }

  onPaging(event) {

  }

  openDialog(customer) {
    const dialogRef = this.dialog.open(AccountingDialogComponent, {
      width: '80%',
      data: {...customer}
    });
    //dialogRef.updateSize('80%');

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

//dialog
@Component({
  selector: 'accounting-dialog',
  templateUrl: './accounting-dialog.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingDialogComponent {
  is_adding= false;

  constructor(
    public dialogRef: MatDialogRef<AccountingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddAccounting() {
    this.is_adding = true;
  }

  onSaveNewAccounting() {
    this.is_adding = false;
  }
}
