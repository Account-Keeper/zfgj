import { Component, OnInit, Input, Output } from '@angular/core';
import { ConfigService } from '../config.service';
import { JobService } from '../job.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  users=[];
  isEdit = false;
  companies = [];

  @Input('job_id') job_id: number;
  constructor(
    private config_service: ConfigService,
    private job_service: JobService,
  ) { }

  ngOnInit() {
    this.getUsers();
    //if(this.filter){
      //this.getCompanies(this.filter);
    //}
  }

  getCompanies(filter) {
    this.job_service.getCustomers(filter).subscribe(data => {
      this.companies = [...data['results']];
    });
  }

  getUsers() {
    if(!this.users)
      this.config_service.getUsers({}).subscribe(data=>{
        if(data){
          this.users = [...data['results']];
        }
      });
  }

}
