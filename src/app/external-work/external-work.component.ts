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
  users = [];
  @Input('job') job: Object;
  @Input('isEdit') isEdit: boolean;

  constructor() { 
    this.external = {};
    this.external['status'] = new FormControl();
    this.external['remarks'] = new FormControl();
    this.external['files'] = [];

  }

  ngOnInit() {
  }

  onFileDropped(files) {
    this.external['files'] = [...files];
  }

}
