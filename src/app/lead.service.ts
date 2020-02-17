import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseService } from './config.service';
import { environment } from '../environments/environment'

export const url_api = 'http://111.229.24.199:8001/';//environment.url_api || '';
const API_TOKEN = "";


@Injectable()
export class LeadService extends BaseService {
  private lead_status = [];
  private lead_source = [];

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    super();
    try {
      this.getSource({});
      this.getStatus({});
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        console.log(e, true);
      } else {
        console.log(e, false);
      }
    }

  }

  get leadStatus() {
    return this.lead_status;
  }

  get leadSource() {
    return this.lead_source;
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
    let params = new HttpParams();
    for (let f in filter) {
      if (filter[f]) {
        params = params.set(f, filter[f]);
      }
    }
    let h = this.getHeaders();
    return this.http.get<any>(url_api + 'leads', { headers: this.getHeaders(), params: params })
      .pipe(map(data => {
        if (data) {
          return data;
        }
        return data;
      }));
  }

  getLead(id) {
    let params = new HttpParams();
    let h = this.getHeaders();
    return this.http.get<any>(`${url_api}leads/${id}`, { headers: this.getHeaders(), params: params })
      .pipe(map(data => {
        if (data) {
          return data;
        }
        return data;
      }));
  }

  saveLead(lead: object) {
    const params: URLSearchParams = new URLSearchParams();
    params.append("api_token", API_TOKEN);

    if (lead['id'])//update
    {
      return this.http.put<any>(url_api + 'leads/' + lead['id'], lead, { headers: this.getHeaders() })
        .pipe(map(data => {
          if (data) {
            return data;
          }
          return null;
        }));
    }
    else {//add new
      return this.http.post<any>(url_api + 'leads', lead, { headers: this.getHeaders() })
        .pipe(map(data => {
          if (data) {
            return data;
          }
          return data;
        }));
    }
  }

  getNotes(id) {
    const params = new HttpParams()
      .set("api_token", API_TOKEN);

    return this.http.get<any>(`${url_api}leads/notes/${id}`, { headers: this.getHeaders() })
      .pipe(map(data => {
        if (data) {
          return data;
        }
        return data;
      }));
  }

  addNote(note) {
    const params: URLSearchParams = new URLSearchParams();
    params.append("api_token", API_TOKEN);

      return this.http.post<any>(url_api + 'leads/note', note, { headers: this.getHeaders() })
        .pipe(map(data => {
          if (data) {
            return data;
          }
          return data;
        }));
  }

  addJob(lead_id) {
    const params: URLSearchParams = new URLSearchParams();
    params.append("api_token", API_TOKEN);

      return this.http.post<any>(url_api + 'leads/job', {lead_id}, { headers: this.getHeaders() })
        .pipe(map(data => {
          if (data) {
            return data;
          }
          return data;
        }));
  }

  getStatus(filter) {
    const params = new HttpParams()
      .set("api_token", API_TOKEN);

    return this.http.get<any>(url_api + 'leads/status/all', { headers: this.getHeaders() })
      .pipe(map(data => {
        if (data) {
          this.lead_status = [...data['results']];
          return data;
        }
        return data;
      }));
  }

  getSource(filter) {
    const params = new HttpParams()
      .set("api_token", API_TOKEN);

    return this.http.get<any>(url_api + 'leads/source/all', { headers: this.getHeaders() })
      .pipe(map(data => {
        if (data) {
          this.lead_source = [...data['results']];
          return data;
        }
        return data;
      }));
  }

  leadToJob(lead_id) {
    const params: URLSearchParams = new URLSearchParams();
    params.append("api_token", API_TOKEN);

      return this.http.get<any>(url_api + 'leads/transfer/'+lead_id, { headers: this.getHeaders() })
        .pipe(map(data => {
          if (data) {
            return data;
          }
          return data;
        }));
  }



}


//external functions

