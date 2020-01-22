import { Component, OnInit, Output, Input, EventEmitter, HostBinding, HostListener  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from  '@angular/forms';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  files: any = [];
  form: FormGroup;
  error: object;

  @HostBinding('style.background-color') private background = '#f5fcff'
  @HostBinding('style.opacity') private opacity = '1'
  @Output() onFileDropped = new EventEmitter<any>();
//Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8'
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
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }
  constructor(
    private formBuilder: FormBuilder,
    private service: ConfigService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      upload: ['']
    });
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
      let file = fileList[0];
      this.form.get('upload').setValue(file);
      let formData: FormData = new FormData();
      formData.append('upload', this.form.get('upload').value);
      let t = 0;
      
      this.service.upload('leads/uploads',formData).subscribe(
        (res) =>{
          if(res && res['status'] == 'success'){
            let filename = res['body']['results']['upload']['name'];
            if(filename)
              this.files.push(filename);
          }
        },
        (err) => this.error = err
      );
    }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

}
