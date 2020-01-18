import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

export const ROLES = [
  { role_name: '一般用户', is_writable: false },
  { role_name: '管理员', is_writable: true },
  { role_name: '主管', is_writable: false },
  { role_name: '超级管理员', is_writable: true },
];

export const url_api = 'http://111.229.24.199:8001/';
const API_TOKEN = "";

export class User {
  username: string;
  password: string;
  role_id: 0;
}

export class BaseService {
  constructor() {

  }

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
}

@Injectable()
export class ConfigService extends BaseService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    super();
    try {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        console.log(e, true);
      } else {
        console.log(e, false);
      }
    }

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  get change(): Observable<object> {
    return this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {
    let body = { username, password };
    const params: URLSearchParams = new URLSearchParams();
    //params.append("api_token", API_TOKEN);

    return this.http.post<any>(url_api + 'auth/login', body, { headers: this.getHeaders() })
      .pipe(map(data => {
        if (data) {
          localStorage.setItem('currentUser', JSON.stringify(data.result));
          localStorage.setItem('token', data.token);
          this.currentUserSubject.next(data.result);
        }
        return data;
      }));
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

  getRoleNameById(id) {
    let obj = ROLES[id];
    if (obj)
      return obj['role_name'];

    return '';
  };
}


//external functions

