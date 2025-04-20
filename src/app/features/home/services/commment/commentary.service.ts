import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../../../config/config';
import { Comment } from '../../models/comments/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentaryService {

  http = inject(HttpClient);
  idCommentWeAreReplying = signal<number>(-1);
  idCommentsWithReply = signal<number[]>([]);
  listOfReplies = signal<Comment[]>([]);
  public createComment(commentary: string, publicationId: number): Observable<any> {
    return this.http.post(config.api.URL_BACKEND + '/comment/new-comment', {
      'comment': commentary,
      'publicationId': publicationId
    });
  }

  public updateListOfReplies(comment:Comment):void{
    debugger;
    this.listOfReplies.update((data:any) => {
      return [...data, comment];
    });
  }
  public replyComment(comment: string,commentaryId:number,publicationId:number): Observable<any> {
    return this.http.post(config.api.URL_BACKEND + '/comment/reply-comment', {comment,commentaryId,publicationId});
  }
}
