import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment'

export const FILE_URL = "http://111.229.24.199:8001/upload/";

export const ROLES = [
  { role_name: '一般用户', is_writable: false },
  { role_name: '管理员', is_writable: true },
  { role_name: '主管', is_writable: false },
  { role_name: '超级管理员', is_writable: true },
];

export const url_api = environment.url_api;
const API_TOKEN = "";

export class User {
  username: string;
  password: string;
  role_id: 0;
}

export class BaseService {
  constructor(
   ) {

  }

  getHeaders(headersConfig?: object): HttpHeaders {
    const token = localStorage.getItem('token') || null;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    if(token)
      headers = headers.set('Authorization', token);
    return headers;
  }
}

@Injectable()
export class ConfigService extends BaseService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private _users;

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    super();
    try {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
      this.getUsers({});
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        console.log(e, true);
      } else {
        console.log(e, false);
      }
    }

  }
  /*
  getHeaders(headersConfig?: object): HttpHeaders {
    var token = localStorage.getItem('token') || null;
    var headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      headers = headers.set('Accept', 'application/json');
      headers = headers.set('Access-Control-Allow-Origin', '*');
      headers = headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      headers = headers.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type, X-Token-Auth, Authorization');
      headers = headers.set('Access-Control-Allow-Credentials', 'true');
      if(token)
        headers = headers.set('Authorization', token);
    return headers;
  }*/
  /*
  private getHeaders(headersConfig?: object): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type, X-Token-Auth, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    });
  }*/

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  get change(): Observable<object> {
    return this.currentUserSubject.asObservable();
  }

  get users() {
    return this._users;
  }

  login(username: string, password: string) {
    var body = { username, password };
    var params: URLSearchParams = new URLSearchParams();
    params.append("api_token", API_TOKEN);
    var token = localStorage.getItem('token') || null;

    return this.http.post<any>(url_api + 'auth/login', body, { headers: this.getHeaders() })
      .pipe(map(data => {
        if (data) {
          localStorage.setItem('currentUser', JSON.stringify(data.result));
          localStorage.setItem('token', data.token);
          this.currentUserSubject.next(data.result);
        }
        return data;
      }),catchError(this.handleError));
  }

  verifyToken() {
    return this.http.get<any>(url_api + 'auth/token', { headers: this.getHeaders() })
      .pipe(map(data => {
        if (data) {
          return data;
        }
        return data;
      }),catchError(this.handleError));
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

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getUsers(filter) {
    let params = new HttpParams()
      .set("api_token", API_TOKEN)
    for (let f in filter) {
      if (filter[f]) {
        params = params.set(f, filter[f]);
      }
    }

    return this.http.get<any>(url_api + 'user/all', { headers: this.getHeaders(), params: params })
      .pipe(map(data => {
        if (data) {
          this._users = data['results'];
          return data;
        }
        return data;
      }));
  }

  saveUser(user: object) {
    const params: URLSearchParams = new URLSearchParams();
    params.append("api_token", API_TOKEN);

    if (user['id'])//update
    {
      return this.http.put<any>(url_api + 'user/' + user['id'], user, { headers: this.getHeaders() })
        .pipe(map(data => {
          if (data) {
            return data;
          }
          return null;
        }));
    }
    else {//add new
      return this.http.post<any>(url_api + 'user', user, { headers: this.getHeaders() })
        .pipe(map(data => {
          if (data) {
            return data;
          }
          return data;
        }));
    }
  }

  removeUser(id) {
    const params: URLSearchParams = new URLSearchParams();
    params.append("api_token", API_TOKEN);

    return this.http.delete<any>(url_api + 'user/' + id, { headers: this.getHeaders() })
      .pipe(map(data => {
        if (data) {
          return data;
        }
        return null;
      }));
  }

  public upload(url, data) {
    let uploadURL = `${url_api}${url}`;

    return this.http.post<any>(uploadURL, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {
      switch (event.type) {

        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress, body:{}};

        case HttpEventType.Response:
          return { status: 'success', message:'', body:event.body };
        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );
  }

  getRoleNameById(id) {
    let obj = ROLES[id];
    if (obj)
      return obj['role_name'];

    return '';
  };
}


//external functions

