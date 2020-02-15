import {Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Http, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs';
import { ConfigService } from './config.service';
import { environment } from '../environments/environment'

export const url_api = environment.url_api;

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: Http,
    private configService: ConfigService,
    ) { }

  downloadFile(file_id):Observable<any>{
    const url = `${url_api}jobs/download?file_id=${file_id}`;
		return this.http.get(url, {responseType: ResponseContentType.Blob});
  }
}
