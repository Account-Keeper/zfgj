import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { INNER_STAUS } from '../job.service';
import { ConfigService } from '../config.service';
import { FileService } from '../file.service';
import { simplifyDatetime,formatDatetimeLocal, formatDate } from '../utility';
import { FileUploadComponent,  } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-internal-work',
  templateUrl: './internal-work.component.html',
  styleUrls: ['./internal-work.component.css']
})
export class InternalWorkComponent implements OnInit {
  selectedItem: {};
  _users = [];
  file_url='';
  internal: Object;
  innerStatus = INNER_STAUS;
  _formatDateTime = formatDatetimeLocal;
  _formatDate = formatDate;
  @Input('isEdit') isEdit: boolean;

  constructor(
    private config_service: ConfigService,
    private file_service: FileService
  ) { 
    this.internal = {};
    this.internal['net_register_status'] = new FormControl();
    this.internal['net_register_date'] = new FormControl();
    this.internal['appointment_date'] = new FormControl();
    this.internal['assignee'] = new FormControl();
    this.internal['remarks'] = new FormControl();
    this.internal['external_assignee'] = new FormControl();
    this.internal['files'] = [];
  }

  ngOnInit() {
  }

  @Input()
  set job(val: any) {
    if(val && val['internal_task']) {
      this.selectedItem = val['internal_task'][0];
      if(!this.selectedItem)
        return;

      if(this.selectedItem['id'])
        this.internal['id'] = this.selectedItem['id'];

      this.internal['net_register_status'].value = this.selectedItem['net_register_status'];
      this.internal['net_register_date'].value = this._formatDateTime(this.selectedItem['net_register_date']);
      this.internal['appointment_date'].value = this._formatDateTime(this.selectedItem['appointment_date']);
      this.internal['assignee'].value = this.selectedItem['assignee'];
      this.internal['remarks'].value = this.selectedItem['remarks'];
      this.internal['external_assignee'].value = this.selectedItem['external_assignee'];
      this.internal['files'] = this.selectedItem['files']?this.selectedItem['files'].map(item=>item.file_path):[];
    }
    else{//new item
      this.selectedItem = {files:[]};
    }
  }

  @Input()
  set users(val: any) {
    if(val)
      this._users = val;
  }

  getNetStatus(id) {
    let res = this.innerStatus.find(item =>  item.id === id);
    if(!res)
      return '';

    return res['label'];
  }

  findUserName(user_id) {
    if(!this._users)
      return '';

    let u = this._users.find(u => u.id === user_id);
    if(!u)
      return '';
    return `${u['first_name']} ${u['last_name']}`;
  }

  onFileDropped(files) {
    this.internal['files'] = [...files];
  }

  onDownloadFile(file_id) {
    if(!file_id)
      return;
      
      this.file_service.downloadFile(file_id).subscribe(response => {
        //let blob:any = new Blob([response.blob()], { type: 'text/json; charset=utf-8' });
        //const url= window.URL.createObjectURL(blob);
        //window.open(url);
        window.location.href = response.url;
        //fileSaver.saveAs(blob, 'employees.json');
      }), error => console.log('Error downloading the file'),
                   () => console.info('File downloaded successfully');
    
  }

}
