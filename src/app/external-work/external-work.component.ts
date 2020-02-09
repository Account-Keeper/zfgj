import { Component, OnInit, Input, Output } from '@angular/core';
import { EXNER_STAUS } from '../job.service';
import { FormControl } from '@angular/forms';
import { ConfigService } from '../config.service';
import { simplifyDatetime,formatDatetimeLocal } from '../utility';
import { FileUploadComponent,  } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-external-work',
  templateUrl: './external-work.component.html',
  styleUrls: ['./external-work.component.css']
})

export class ExternalWorkComponent implements OnInit {
  externalStatus = EXNER_STAUS;
  external = {};
  selectedItem: {};
  _users = [];
  @Input('isEdit') isEdit: boolean;

  constructor() { 
    this.external = {};
    this.external['status'] = new FormControl();
    this.external['remarks'] = new FormControl();
    this.external['files'] = [];

  }

  ngOnInit() {
  }

  @Input()
  set job(val: any) {
    if(val && val['external_task']) {
      this.selectedItem = val['external_task'][0];
      if(!this.selectedItem)
      return;
      
      this.external['status'].value = this.selectedItem['status'];
      this.external['remarks'].value = this.selectedItem['remarks'];
      this.external['files'] = this.selectedItem['files'];
    }
  }

  @Input()
  set users(val: any) {
    if(val)
      this._users = val;
  }

  onFileDropped(files) {
    this.external['files'] = [...files];
  }

  getStatus(id) {
    let res = this.externalStatus.find(item =>  item.id === id);
    if(!res)
      return '';

    return res['label'];
  }

}
