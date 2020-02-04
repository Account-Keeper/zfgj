import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { INNER_STAUS } from '../job.service';
import { ConfigService } from '../config.service';
import { simplifyDatetime,formatDatetimeLocal } from '../utility';
import { FileUploadComponent,  } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-internal-work',
  templateUrl: './internal-work.component.html',
  styleUrls: ['./internal-work.component.css']
})
export class InternalWorkComponent implements OnInit {
  selectedItem: {};
  users = [];
  internal: Object;
  innerStatus = INNER_STAUS;
  @Input('isEdit') isEdit: boolean;
  @Input('isHidden') isHidden: boolean;

  constructor(
    private config_service: ConfigService,
  ) { 
    this.internal = {};
    this.internal['fullname'] = new FormControl();
    this.internal['created_date'] = new FormControl();
    this.internal['net_register_status'] = new FormControl();
    this.internal['net_register_date'] = new FormControl();
    this.internal['appointment_date'] = new FormControl();
    this.internal['assignee'] = new FormControl();
    this.internal['remarks'] = new FormControl();
    this.internal['external_assignee'] = new FormControl();
    this.internal['files'] = [];
  }

  ngOnInit() {
    this.getUsers();
  }

  @Input()
  set job(val: any) {
    if(val && val['internal_taks'])
      this.selectedItem = val['internal_taks'][0];
    let t = 0;
  }

  getUsers() {
    this.users = this.config_service.users;
  }

  getNetStatus(id) {
    let res = this.innerStatus.find(item =>  item.id === id);
    if(!res)
      return '';

    return res['label'];
  }

  findUserName(user_id) {
    let u = this.config_service.users.find(u => u.id === user_id);
    if(!u)
      return '';
    return `${u['first_name']} ${u['last_name']}`;
  }

  onFileDropped(files) {
    this.internal['files'] = [...files];
  }

}
