import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { config } from '../../../../config/config';
import { Observable } from 'rxjs';
import { Publication } from '../../models/publications/publication';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  http = inject(HttpClient);
  data = signal<Publication[]>([]);

  public getListPublications(page:number):Observable<any>{
    return this.http.get(config.api.URL_BACKEND + '/publications/page/'+page);
  }

  public getNumberDays(date: string) {

    let msDay = (1000 * 60 * 60 * 24);

    let dateMs = new Date(date).getTime();

    let diff = Date.now() - dateMs;

    let diffDays = Math.ceil(diff / msDay);

    let result = diffDays + ' días';

    let diffHours = -1;

    let diffMins = -1;

    if (diffDays < 1) {
      diffHours = Math.round((diff / (1000 * 60 * 60)));
      result = diffHours + ' h';
    }

    if (diffHours == 0) {
      diffMins = Math.floor((diff / (1000 * 60)));
      result = diffMins + ' m';
    }

    return result;
  }
}
