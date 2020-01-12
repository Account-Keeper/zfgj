import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

export const url_api = 'http://111.229.24.199:8001/';
const API_TOKEN = "";


@Injectable()
export class LeadService {

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    try{
    }
    catch (e) {
      if (e instanceof SyntaxError) {
          console.log(e, true);
      } else {
          console.log(e, false);
      }
  }

   }

  private getHeaders(headersConfig?: object): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type, X-Token-Auth, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

  getLeads(filter) {
    const params = new HttpParams()
        .set("api_token", API_TOKEN);

    return this.http.get<any>(url_api+'leads', {headers: this.getHeaders()})
    .pipe(map(data=>{
      if(data){
        return data;
      }
      return data;
    }));
  }

  getStatus(filter) {
    const params = new HttpParams()
        .set("api_token", API_TOKEN);

    return this.http.get<any>(url_api+'leads/status/all', {headers: this.getHeaders()})
    .pipe(map(data=>{
      if(data){
        return data;
      }
      return data;
    }));
  }

  getSource(filter) {
    const params = new HttpParams()
        .set("api_token", API_TOKEN);

    return this.http.get<any>(url_api+'leads/source/all', {headers: this.getHeaders()})
    .pipe(map(data=>{
      if(data){
        return data;
      }
      return data;
    }));
  }

}


//external functions

