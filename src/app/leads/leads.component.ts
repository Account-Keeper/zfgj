import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead.service';
import { ConfigService } from '../config.service';
import { FormControl } from '@angular/forms';
import { simplifyDatetime } from '../utility';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  isEdit = false;
  isDetail = false;
  isLoading=false;
  user = {};
  leads = [];
  lead_status = [];
  lead_source = [];
  lead = {};
  filter = {};
  selectedLead = {};
  simplifyDatetime = simplifyDatetime;
  displayedColumns: string[] = ['selected','contact_name','city','contact_phone','contact_email',
      'source_name','status_name','assignee','detail','updated_date'];
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  constructor(
    private lead_service: LeadService,
    private config_service: ConfigService,
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
    this.lead['city'] = new FormControl();
    this.lead['lead_cost'] = new FormControl();

    this.filter['city'] = new FormControl;
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
          item['updated_date'] = this.simplifyDatetime(item['updated_date']);
          item['detail'] = item.id;
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

  displayUser(assignee) {
    if(!assignee && !Array.isArray(assignee))
      return '';

    return `${assignee[0].first_name} ${assignee[0].last_name}`;
  }

  onAssign(id) {
    let user = this.config_service.currentUserValue;
    const lead = {};
    lead['id'] = id;
    lead['assignee'] = user.id;
    this.lead_service.saveLead(lead).subscribe(data=>{
      if(data){
        this.getLeads();
      }
    });
  }

  onAddLead() {
    this.isEdit = true;
    this.isDetail = false;
  }

  onAddUser() {
    let user = this.config_service.currentUserValue;
    this.lead['assignee'] = user.id;
  }

  onSave() {

  }

  onUpdateLead() {

  }

  OnDetail(id) {
    const lead = this.leads.find(item=>item.id === id);
    this.selectedLead = lead;
    this.isDetail = true;
  }

  onCancel(load) {
    this.isEdit = false;
    this.isDetail = false;
    if(load)
      this.getStatus();
  }

}
