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
  @Input('job') job: Object;
  @Input('isEdit') isEdit: boolean;

  constructor(
    private config_service: ConfigService,
  ) { 
    this.internal = {};
    this.internal['fullname'] = new FormControl();
    this.internal['created_date'] = new FormControl();
    this.internal['inner_status'] = new FormControl();
    this.internal['inner_appointment_datetime'] = new FormControl();
    this.internal['external_assignee'] = new FormControl();
    this.internal['remarks'] = new FormControl();

    this.internal['inner_status'].value = 0;
    this.internal['external_assignee'].value = -1;
    this.internal['inner_appointment_datetime'].value = formatDatetimeLocal(new Date());
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    if(this.users.length==0)
      this.config_service.getUsers({}).subscribe(data=>{
        if(data){
          this.users = [{id:-1, first_name:"未指派", last_name:'',username:null}, ...data['results']];
        }
      });
  }

  onFileDropped(files) {
    this.internal['files'] = [...files];
  }

}
