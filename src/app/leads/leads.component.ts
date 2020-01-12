import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  isEdit = false;
  isLoading=false;
  user = {};
  leads = [];
  lead_status = [];
  lead_source = [];
  lead = {};
  displayedColumns: string[] = ['contact_name','contact_phone','contact_email','source_name','status_name'];

  constructor(
    private lead_service: LeadService
  ) { }

  ngOnInit() {
    this.initLead();
    this.getStatus();
  }

  initLead() {
    this.lead = {};
    this.lead['source_id'] = new FormControl();
    this.lead['contact_name'] = new FormControl();
    this.lead['contact_email'] = new FormControl();
    this.lead['contact_phone'] = new FormControl();
    this.lead['lead_cost'] = new FormControl();
  }

  getLeads() {
    this.lead_service.getLeads({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        arr.forEach(item=>{
          let source_name = this.lead_source.find(s=>s.id === item['source_id']);
          let status_name = this.lead_status.find(s=>s.id === item['status']);
          item['status_name'] = status_name.label;
          item['source_name'] = source_name.label;
          item['customer_fullname'] = `${item.first_name} ${item.last_name}`;
        });
        this.leads = arr;
      }
    });
    this.isLoading = false;
  }

  getStatus() {
    this.isLoading = true;
    this.lead_service.getStatus({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        this.lead_status = arr;
        this.getSource();
      }
    });
  }

  getSource() {
    this.lead_service.getSource({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        this.lead_source = arr;
        this.getLeads();
      }
    });
  }


  onAdd() {

  }

}
