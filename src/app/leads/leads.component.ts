import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead.service';
import { ConfigService } from '../config.service';
import { FormControl } from '@angular/forms';
import { simplifyDatetime, formatDate } from '../utility';

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
  users = [];
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
    this.lead['assignee'] = new FormControl();
    this.lead['contact_email'] = new FormControl();
    this.lead['contact_phone'] = new FormControl();
    this.lead['city'] = new FormControl();
    this.lead['lead_cost'] = new FormControl();

    this.filter['date_from'] = new FormControl;
    this.filter['date_to'] = new FormControl;
    this.filter['city'] = new FormControl;
    this.filter['assignee'] = new FormControl;
    this.filter['lead_source'] = new FormControl;
    this.filter['search'] = new FormControl;
    this.filter['status'] = new FormControl;

    this.getUsers();
  }

  getLeads() {
    let filters = {};
    let date_from = this.filter['date_from'].value;
    let date_to = this.filter['date_to'].value;

    date_from = Date.parse(date_from);
    date_to = Date.parse(date_to);
    let df = new Date(date_from);
    if(date_from){
      filters['date_from'] = formatDate(df);
    }
    if(this.filter['lead_source'].value) {
      filters['source_ids'] = [parseInt(this.filter['lead_source'].value)];
    }
    filters['date_to'] = this.filter['date_to'].value;
    filters['city'] = this.filter['city'].value;
    filters['assignee'] = this.filter['assignee'].value;
    filters['search'] = this.filter['search'].value;
    filters['status'] = this.filter['status'].value;

    this.lead_service.getLeads(filters).subscribe(data=>{
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

  getUsers() {
    this.config_service.getUsers({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        arr.forEach(item=>{
          item['display_name'] = item['first_name'] + item['last_name'];
        });
        this.users = [...arr];
      }
    });
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

  onRefresh() {
    this.initLead();
    this.getLeads();
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
    lead['assignee'] = user['id'];
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
    this.lead['assignee'] = user['id'];
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

  claim_time(created, assigned) {
  const created_date = new Date(created);
  const assigned_date = new Date(assigned);

  //created = date_parser.parse(self.data['created'].partition('+')[0])
  //assigned = date_parser.parse(self.data['assigned'].partition('+')[0])
  //seconds = (assigned - created).total_seconds()
  //return format_seconds(seconds)
  }
}
