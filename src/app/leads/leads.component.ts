import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead.service';

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

  constructor(
    private lead_service: LeadService
  ) { }

  ngOnInit() {
  }

  getLeads() {
    this.lead_service.getLeads({}).subscribe(data=>{
      if(data){
        let arr = [...data['results']];
        arr.forEach(item=>{
        });
        this.leads = arr;
      }
    });


}
