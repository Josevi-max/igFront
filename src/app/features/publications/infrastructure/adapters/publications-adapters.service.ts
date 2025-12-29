import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicationsAdaptersService {

  public addLikePublicationAdapter(publicationId: number): HttpParams {
    let params = new HttpParams();
    params = params.append('publicationId', publicationId);
    return params;
  }

  public removeLikePublicationAdapter(publicationId: number): HttpParams {
    let params = new HttpParams();
    params = params.append('publicationId', publicationId);
    return params;
  }
}
