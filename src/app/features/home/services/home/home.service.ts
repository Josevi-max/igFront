import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { config } from '../../../../config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  http = inject(HttpClient);

  public getListPublications(page:number):Observable<any>{
    return this.http.get(config.api.URL_BACKEND + '/publications/page/'+page);
  }
}
