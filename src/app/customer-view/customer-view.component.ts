import { Component, OnInit } from '@angular/core';
import {forkJoin} from 'rxjs';
import { ConfigService,FILE_URL } from '../config.service';
import { FormControl } from '@angular/forms';
import { JobService, JOB_TYPE, PAYMENT_METHODS, 
  TAXPAYER_TYPE, TAX_TYPE, BUSINESS_TYPE } from '../job.service';
  import { formatDate,formatDate_Date } from '../utility'
  import { ActivatedRoute, Router,Event,NavigationStart,NavigationEnd,NavigationError } from '@angular/router';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  customers = [];
  selectedItem = {};
  selected_customer_id:number;
  users = [];
  is_loading = false;
  isEdit = false;
  displayedColumns: string[] = ['selected','company_name','contact_fullname','cell_phone',
  'city'];

  constructor(
    private router: Router,
    private routerRoute: ActivatedRoute,
    private config_service: ConfigService,
    private job_service: JobService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   }
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
      }

      if (event instanceof NavigationEnd) {
      }

      if (event instanceof NavigationError) {
          console.log(event.error);
      }
  });

    routerRoute.paramMap.subscribe(
      params => {
        this.selected_customer_id = parseInt(params.get('id'));
        if(!this.selected_customer_id) {
          
        }
      }
    );

   }

  ngOnInit() {
    this.is_loading = true;
    forkJoin([
      this.config_service.getUsers({}),
      this.job_service.getCustomers({})
    ]).subscribe(data => {
      this.users = [...data[0]['results']];
      this.customers = [...data[1]['results']];
      this.is_loading = false;
    });
  }

}
