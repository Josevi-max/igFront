import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CommentAdaptersService } from '../adapters/comment-adapters.service';
import { config } from '../../../../config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentApiService {

  private http = inject(HttpClient);
  private readonly commentAdaptersService = inject(CommentAdaptersService);

  public createComment(commentary: string, publicationId: number): Observable<any> {
    const httpParams = this.commentAdaptersService.newCommentAdapter(commentary, publicationId);
    return this.http.post(config.api.URL_BACKEND + '/comment/new-comment', httpParams);
  }

  public replyComment(comment: string, commentaryId: number, publicationId: number): Observable<any> {
    const httpParams = this.commentAdaptersService.replyCommentAdapter(comment, commentaryId, publicationId);
    return this.http.post(config.api.URL_BACKEND + '/comment/reply-comment', httpParams);
  }

  public addLikeComment(commentId: number): Observable<any> {
    const httpParams = this.commentAdaptersService.addLikeCommentAdapter(commentId);
    return this.http.post(config.api.URL_BACKEND + '/comment/like', httpParams);
  }

  public removeLikeComment(commentId: number): Observable<any> {
    const httpParams = this.commentAdaptersService.removeLikeCommentAdapter(commentId);
    return this.http.post(config.api.URL_BACKEND + '/comment/remove-like', httpParams);
  }

  public getCommentsOfPublication(publicationId: number): Observable<any> {
    return this.http.get(config.api.URL_BACKEND + '/comment/get-comments/' + publicationId);
  }
}
