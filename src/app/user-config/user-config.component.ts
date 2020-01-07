import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ConfigService }  from '../config.service';
import { simplifyDatetime } from '../utility';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.css']
})
export class UserConfigComponent implements OnInit {
  displayedColumns: string[] = ['username', 'full_name', 'role_name','cell_phone','work_phone',
  'wechat_id','email','is_active','updated_date','edit','remove'];
  users = [];
  isAuth: Boolean;
  currentUser: Object;

  constructor(
    private service: ConfigService,
    private router: Router,
  ) { 
    this.isAuth = false;
  }

  ngOnInit() {
    if(!this.service.currentUserValue){
      this.isAuth = false;
      this.router.navigate(['/login']);
    }

    this.getUsers();
  }

  getUsers() {
    this.service.getUsers({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        arr.forEach(user=>{
          user['full_name'] = `${user['first_name']} ${user['last_name']}`;
          user['role_name'] = this.service.getRoleNameById(user['role_id']);
        });
        this.users = arr;
      }
    });
  }

  _simplifyDatetime(date) {
    return simplifyDatetime(date);
  }

}
