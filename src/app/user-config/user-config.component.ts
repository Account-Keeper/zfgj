import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ConfigService, ROLES }  from '../config.service';
import { simplifyDatetime } from '../utility';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  id: number;
  username: string;
}

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.css']
})
export class UserConfigComponent implements OnInit {
  displayedColumns: string[] = ['username', 'full_name', 'role_name','cell_phone','work_phone',
  'wechat_id','email','is_active','updated_date','edit','remove'];
  users = [];
  status = [];
  isAuth: Boolean;
  isEdit = false;
  currentUser: Object;
  roles = [];
  roleControl = new FormControl(0);
  statusControl = new FormControl(1);
  password = new FormControl('');
  repassword = new FormControl('');
  user = {};
  isLoading = false;

  constructor(
    private service: ConfigService,
    private router: Router,
    public dialog: MatDialog,
  ) { 
    this.isAuth = false;
    this.roles = ROLES.map((r, index)=>{
      return {value:index, viewValue:r.role_name};
    });

    this.status = [{value: 0,viewValue:'停止'},{value: 1,viewValue:'运行'}];
    this.initUser();
  }

  ngOnInit() {
    if(!this.service.currentUserValue){
      this.isAuth = false;
      this.router.navigate(['/login']);
    }

    this.getUsers();
  }

  initUser() {
    this.user = {};
    this.user['username'] = new FormControl();
    this.user['first_name'] = new FormControl();
    this.user['last_name'] = new FormControl();
    this.user['email'] = new FormControl();
    this.user['cell_phone'] = new FormControl();
    this.user['work_phone'] = new FormControl();
    this.user['is_active'] = new FormControl();
    this.user['wechat_id'] = new FormControl();
    this.user['role_id'] = new FormControl();
  }

  getUsers() {
    this.isLoading = true;
    this.service.getUsers({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        arr.forEach(user=>{
          user['full_name'] = `${user['last_name']} ${user['first_name']}`;
          user['role_name'] = this.service.getRoleNameById(user['role_id']);
        });
        this.users = arr;
        this.isLoading = false;
      }
    });
  }

  onAdd() {
    this.initUser();
    this.isEdit = true;
  }

  onEdit(item) {
    this.isEdit = !this.isEdit;
    if(item.id){
      this.user['id'] = new FormControl(item.id)
    }
    this.user['username'].setValue(item.username);
    this.user['first_name'].setValue(item.first_name);
    this.user['last_name'].setValue(item.last_name);
    this.user['email'].setValue(item.email);
    this.user['cell_phone'].setValue(item.cell_phone);
    this.user['work_phone'].setValue(item.work_phone);
    this.user['is_active'].setValue(item.is_active);
    this.user['wechat_id'].setValue(item.wechat_id);
    this.user['role_id'].setValue(item.role_id);
  }

  onSave() {
    if(this.user['username'].valid) {
      let data = {};
      if(this.user['id'])
        data['id'] = this.user['id'].value;
      if(this.password)
        data['password'] = this.password.value;

      data['username'] = this.user['username'].value;
      data['first_name'] = this.user['first_name'].value;
      data['last_name'] = this.user['last_name'].value;
      data['email'] = this.user['email'].value;
      data['cell_phone'] = this.user['cell_phone'].value;
      data['work_phone'] = this.user['work_phone'].value;
      data['is_active'] = this.user['is_active'].value;
      data['wechat_id'] = this.user['wechat_id'].value;
      data['role_id'] = this.user['role_id'].value;

      this.service.saveUser(data).subscribe(p=>{
        this.isEdit = !this.isEdit;
        this.getUsers();
      });

    }
  }

  onCancel() {
    this.isEdit = false;
  }

  removeUser(id) {
    if(id){
      this.service.removeUser(id).subscribe(p=>{
        this.getUsers();
      });
    }
  }

  _simplifyDatetime(date) {
    return simplifyDatetime(date);
  }

  openDialog(item): void {
    const dialogRef = this.dialog.open(UserRemoveConfirmDialog, {
      width: '300px',
      data: {id:item.id, username:item.username}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.removeUser(result);
      }
    });
  }

}

//Dialog
@Component({
  selector: 'user-remove-confirm-dialog',
  templateUrl: 'confirm-dialog.html',
})
export class UserRemoveConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<UserRemoveConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}