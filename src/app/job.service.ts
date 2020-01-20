import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseService } from './config.service';
import { environment } from '../environments/environment'

export const url_api = environment.url_api;

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
