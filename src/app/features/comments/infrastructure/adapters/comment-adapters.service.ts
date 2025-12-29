import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentAdaptersService {

  public newCommentAdapter(commentary: string, publicationId: number): HttpParams {
    let params = new HttpParams();
    params = params.append('comment', commentary);
    params = params.append('publicationId', publicationId);
    return params;
  }

  public replyCommentAdapter(comment: string, commentaryId: number, publicationId: number): HttpParams {
    let params = new HttpParams();
    params = params.append('comment', comment);
    params = params.append('commentaryId', commentaryId);
    params = params.append('publicationId', publicationId);
    return params;
  }

  public addLikeCommentAdapter(commentId: number): HttpParams {
    let params = new HttpParams();
    params = params.append('commentId', commentId);
    return params;
  }

  public removeLikeCommentAdapter(commentId: number): HttpParams {
    let params = new HttpParams();
    params = params.append('commentId', commentId);
    return params;
  }
}
