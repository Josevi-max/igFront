import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { config } from '../../../../config/config';
import { Observable } from 'rxjs';
import { PublicationsAdaptersService } from '../adapters/publications-adapters.service';
import { CommonsAdaptersService } from '../../../../core/infrastructure/adapters/commons/commons-adapters.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationsApiService {
  private readonly http = inject(HttpClient);
  private readonly publicationsAdaptersService = inject(PublicationsAdaptersService);
  private readonly commonsAdaptersService = inject(CommonsAdaptersService);

  public getListPublications(page: number): Observable<any> {
    return this.http.get(config.api.URL_BACKEND + '/publications/page/' + page);
  }

  public likePublication(publicationId: number): Observable<any> {
    const httpParams = this.publicationsAdaptersService.addLikePublicationAdapter(publicationId);
    const headers = this.commonsAdaptersService.addExceptionHeader();
    return this.http.post(config.api.URL_BACKEND + '/publications/like', httpParams, {headers});
  }

  public removeLikePublication(publicationId: number): Observable<any> {
    const httpParams = this.publicationsAdaptersService.removeLikePublicationAdapter(publicationId);
    const headers = this.commonsAdaptersService.addExceptionHeader();
    return this.http.post(config.api.URL_BACKEND + '/publications/unlike', httpParams, {headers});
  }
}
