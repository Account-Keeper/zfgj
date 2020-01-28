import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead.service';
import { ConfigService } from '../config.service';
import { FormControl } from '@angular/forms';
import { simplifyDatetime, formatDate, formatDatetimeLocal } from '../utility';
import {from as fromPromise, of} from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import { CONTACT_TYPE } from '../job.service';

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
  note = {};
  users = [];
  leads = [];
  lead_status = [];
  lead_source = [];
  notes = [];
  lead = {};
  filter = {};
  selectedLead = {};
  Pagelength = 0;
  pageSize = 10;
  contact_type = CONTACT_TYPE;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['selected','contact_name','city','contact_phone','contact_email',
      'source_name','status_name','assignee','detail','updated_date'];
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  pageEvent: PageEvent;

  constructor(
    private lead_service: LeadService,
    private config_service: ConfigService,
  ) { 
  }

  ngOnInit() {
    this.initLead();

  }

  initLead() {
    this.lead = {};
    this.lead['source_id'] = new FormControl();
    this.lead['assignee'] = new FormControl();
    this.lead['contact_name'] = new FormControl();
    this.lead['contact_email'] = new FormControl();
    this.lead['contact_phone'] = new FormControl();
    this.lead['city'] = new FormControl();
    this.lead['lead_cost'] = new FormControl();
    this.lead['status'] = new FormControl();

    this.filter['date_from'] = new FormControl;
    this.filter['date_to'] = new FormControl;
    this.filter['city'] = new FormControl;
    this.filter['assignee'] = new FormControl;
    this.filter['lead_source'] = new FormControl;
    this.filter['search'] = new FormControl;
    this.filter['status'] = new FormControl;

    this.note = {};
    this.note['message'] = new FormControl();
    this.note['contact_type'] = new FormControl();

    this.getStatus();

    this.getUsers();
  }

  public onPaging(event?:PageEvent) {
    this.pageEvent = event;
    this.getLeads();
    return event;
  }

  private _simplifyDatetime(date) {
    return simplifyDatetime(date);
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
    filters['page_length'] = this.Pagelength;
    filters['page_size'] = this.pageSize;
    filters['page_index'] = 0;

    if(this.pageEvent){
      filters['page_length'] = this.pageEvent.length;
      filters['page_size'] = this.pageEvent.pageSize;
      filters['page_index'] = this.pageEvent.pageIndex;
    }

    this.lead_service.getLeads(filters).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        this.Pagelength = data['count'] || 0;
        
        arr.forEach(item=>{
          let source_name = this.lead_source.find(s=>s.id === item['source_id']);
          let status_name = this.lead_status.find(s=>s.id === item['status']);
          item['status_name'] = status_name.label;
          item['source_name'] = source_name.label;
          item['customer_fullname'] = `${item.first_name} ${item.last_name}`;
          item['updated_date'] = this._simplifyDatetime(item['updated_date']);
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
    return this.lead_service.getStatus({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        this.lead_status = arr;
        this.getSource();
      }
    });
  }

  onRefresh() {
    this.isEdit = false;
    this.isDetail = false;
    this.initLead();
    if(!this.lead_status || !this.lead_source)
      this.getStatus();
    else
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

  getNotes(id) {
    this.lead_service.getNotes(id).subscribe(data=>{
      if(data){
        let arr = data['results'] || [];
        arr.forEach(item => {
          item['created_date'] = formatDatetimeLocal(item['created_date']);
        });
        this.notes = [...arr];
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

  onEditLead(item) {
    this.lead['id'] = item.id;
    this.lead['source_id'].value = item.source_id;
    this.lead['contact_name'].value = item.contact_name;
    this.lead['contact_email'].value = item.contact_email ||'';
    this.lead['contact_phone'].value = item.contact_phone;
    this.lead['city'].value = item.city;
    this.lead['status'].value = item.status || 0;
    this.lead['lead_cost'].value = item.lead_cost || '';
    if(item.assignee)
      this.lead['assignee'].value = item.assignee[0].id;

    this.selectedLead = item;
    this.isEdit = true;
    this.isDetail = false;
  }

  onAddUser() {
    let user = this.config_service.currentUserValue;
    this.lead['assignee'] = user['id'];
  }

  onSave() {
    if(this.lead['contact_name'].errors || this.lead['contact_phone'].errors || this.lead['city'].errors || this.lead['source_id'].errors)
      return;

    const data = {};
    data['id'] = this.lead['id'] || null;
    data['assignee'] = this.lead['assignee'].value;
    data['contact_name'] = this.lead['contact_name'].value;
    data['contact_phone'] = this.lead['contact_phone'].value;
    data['city'] = this.lead['city'].value;
    data['source_id'] = this.lead['source_id'].value;
    data['status'] = this.lead['status'].value;
    
      this.lead_service.saveLead(data).subscribe(data=>{
        if(data){
          this.getLeads();
          this.onRefresh();
        }
      });
  }

  onUpdateLead() {

  }

  onAddNode() {
    if(this.note && this.selectedLead && !this.note['message'].errors &&!this.note['contact_type'].errors) {
      const note = {};
      note['lead_id'] = this.selectedLead['id'];
      note['message'] = this.note['message'].value;
      note['contact_type'] = this.note['contact_type'].value;

      this.lead_service.addNote(note).subscribe(data=>{
        if(data){
          this.note['message'].value = '';
          this.note['contact_type'].value = 0;

          this.getNotes(this.selectedLead['id']);
        }
      });
    }
  }

  onCreatJob(lead_id) {
    this.lead_service.addJob(lead_id).subscribe(data=>{
      if(data){
        this.OnDetail(lead_id);
      }
    });
  }

  OnDetail(id) {
    const lead = this.leads.find(item=>item.id === id);
    if(lead) {
      this.lead_service.getLead(lead.id).subscribe(data=>{
        if(data){
          this.selectedLead = data['results'][0];
          this.isDetail = true;
          this.getNotes(id);
        }
      });
    }

  }

  onCancel(load) {
    this.isEdit = false;
    this.isDetail = false;
    if(load)
      this.getStatus();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  claim_time(created, assigned) {
  const created_date = new Date(created);
  const assigned_date = new Date(assigned);
  }

  getContactType(id) {
    let n = this.contact_type.find(item => item.id === id);
    if(n)
      return n.label;
    return '';
  }

}
