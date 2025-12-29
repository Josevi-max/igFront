import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonsAdaptersService {

  public addExceptionHeader(): HttpHeaders {
    return new HttpHeaders({
      'X-Exception': 'true'
    });
  }
}
