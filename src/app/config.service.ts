import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


export const url_api = 'http://111.229.24.199:8001/';
const API_TOKEN = "";

export default interface User {
    username: string;
    password: string;
    role_id: 0;
  }

@Injectable()
export class ConfigService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    try{
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

  login(username:string, password:string) {
    let body = {username, password};
    const params: URLSearchParams = new URLSearchParams();
          params.append("api_token", API_TOKEN);

    return this.http.post<any>(url_api+'auth/login', body, {headers: this.getHeaders()})
    .pipe(map(data=>{
      if(data){
        localStorage.setItem('currentUser', JSON.stringify(data.result));
        this.currentUserSubject.next(data);
      }
      return data;
    }));
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

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}