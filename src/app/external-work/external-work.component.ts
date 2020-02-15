import { Component, OnInit, Input, Output } from '@angular/core';
import { EXNER_STAUS } from '../job.service';
import { FormControl } from '@angular/forms';
import { ConfigService } from '../config.service';
import { FileService } from '../file.service';
import { simplifyDatetime,formatDate } from '../utility';
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
  _formatDate = formatDate;
  @Input('isEdit') isEdit: boolean;
  file_url='';

  constructor(
    private file_service: FileService
  ) { 
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


      if(this.selectedItem['id'])
        this.external['id'] = this.selectedItem['id'];

      this.external['status'].value = this.selectedItem['status'];
      this.external['remarks'].value = this.selectedItem['remarks'];
      this.external['files'] = this.selectedItem['files']?this.selectedItem['files'].map(item=>item.file_path):[];
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

  onFileDropped(files) {
    this.external['files'] = [...files];
  }

  getStatus(id) {
    let res = this.externalStatus.find(item =>  item.id === id);
    if(!res)
      return '';

    return res['label'];
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
