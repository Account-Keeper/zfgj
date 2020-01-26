import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseService } from './config.service';
import { environment } from '../environments/environment'

export const JOB_TYPE = [
  { id: 0, label:'业务类型1' },
  { id: 1, label:'业务类型2' },
  { id: 2, label:'业务类型3' },
  { id: 3, label:'业务类型4' },
];

export const PAYMENT_METHODS = [
  { id: 0, label:'公司转账' },
  { id: 1, label:'支付宝' },
  { id: 2, label:'微信' },
  { id: 3, label:'刷卡' },
  { id: 4, label:'现金' },
  { id: 5, label:'其他' },
];//付款方式

export const TAXPAYER_TYPE = [
  { id: 0, label:'小规模' },
  { id: 1, label:'一般人' },
];//纳税人类型

export const TAX_TYPE = [
  { id: 0, label:'税控盘托管' },
  { id: 1, label:'客户自持' },
  { id: 2, label:'其他' },
];//税控类型

export const BUSINESS_TYPE = [
  { id: 0, label:'销售' },
  { id: 1, label:'科技' },
  { id: 2, label:'地产' },
  { id: 3, label:'服务' },
  { id: 4, label:'其他' },
];//企业类型

export const INNER_STAUS = [
  { id: 0, label:'已开始' },
  { id: 1, label:'未开始' },
  { id: 2, label:'已完成' },
];//网登状态*：（已开始/未开始/已完成）

export const CONTACT_TYPE = [
  { id: 0, label:'电话' },
  { id: 1, label:'微信' },
  { id: 2, label:'电话+微信' },
];//网登状态*：（已开始/未开始/已完成）

export const url_api = 'http://111.229.24.199:8001/';//environment.url_api || '';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  jobTypes = [];

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  public getHeaders(headersConfig?: object): HttpHeaders {
    const token = localStorage.getItem('token') || null;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type, X-Token-Auth, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Authorization': token
    });
  }

  getJobType(filter) {
    const params = new HttpParams()

    return this.http.get<any>(url_api + 'jobs/types', { headers: this.getHeaders() })
      .pipe(map(data => {
        if (data) {
          this.jobTypes = [...data['results']];
          return data;
        }
        return data;
      }));
  }

  getCustomers(filter) {
    let params = new HttpParams();
    for (let f in filter) {
      if (filter[f]) {
        params = params.set(f, filter[f]);
      }
    }

    return this.http.get<any>(url_api + 'customers/all', { headers: this.getHeaders(), params: params } )
      .pipe(map(data => {
        if (data) {
          return data;
        }
        return data;
      }));
  }
}
