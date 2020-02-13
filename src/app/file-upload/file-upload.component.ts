import { Component, OnInit, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ConfigService } from '../config.service';
import { JobService } from '../job.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  files: any = [];
  form: FormGroup;
  error: object;
  _type: string;
  is_loading = false;

  private background = '#9ecbec';
  private opacity = '0.8';
  @Output() onFileDropped = new EventEmitter<any>();

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
    let files = evt.dataTransfer.files;

  }

  constructor(
    private formBuilder: FormBuilder,
    private service: ConfigService,
    private job_service: JobService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      upload: ['']
    });
  }

  @Input('uploads')
  set uploads(val: any) {
    if (val) {
      this.files = val;
    }
  }

  @Input('type')
  set type(val: any) {
    if (val) {
      this._type = val;
    }
  } 

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
    }
  }

  uploadDocument(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.is_loading = true;
      let file = fileList[0];
      this.form.get('upload').setValue(file);
      let formData: FormData = new FormData();
      formData.append('upload', this.form.get('upload').value);

      this.service.upload('leads/uploads', formData).subscribe(
        (res) => {
          if (res && res['status'] == 'success') {
            let filename = res['body']['results']['upload']['name'];
            if (filename) {
              let data = {};
              data['file_path'] = filename;
              this.files.push(data);

            }

            if (this.files.length > 0) {
              this.onFileDropped.emit(this.files.map(item => item['file_path']));
            }
          }
          this.is_loading = false;
        },
        (err) => this.error = err
      );
    }
  }

  getFiles(filter) {
    this.job_service.getFiles(filter).subscribe(res => {
      if (res) {
        this.files = [...res['results']];
        this.onFileDropped.emit(this.files.map(item => item['file_path']));
      }
    });
  }

  deleteAttachment(file) {
    if (!file['id'])//new added file
    {
      this.files = this.files.filter(item => item.file_path !== file['file_path']);
      this.onFileDropped.emit(this.files.map(item => item['file_path']));
    }
    else {
      this.job_service.removeFile(file.id).subscribe((res) => {
        let filter = {};
        filter[this._type] = file[this._type];
        filter['job_id'] = file['job_id'];
        this.getFiles(filter);
      });
    }
  }

}
