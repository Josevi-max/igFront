import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CommentaryService {

  http = inject(HttpClient);

  public createComment(commentary: string, publicationId: number): Observable<any> {
    return this.http.post(config.api.URL_BACKEND + '/comment/new-comment', {
      'comment': commentary,
      'publicationId': publicationId
    });
  }
}
