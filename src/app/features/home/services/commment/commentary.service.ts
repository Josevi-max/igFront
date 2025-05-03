import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../../../config/config';
import { Comment } from '../../models/comments/comment';
import { HomeService } from '../home/home.service';
import { AuthService } from '../../../auth/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentaryService {

  http = inject(HttpClient);
  homeService = inject(HomeService);
  authService = inject(AuthService);
  idCommentWeAreReplying = signal<number>(-1);
  idCommentsWithReply = signal<number[]>([]);
  listOfReplies = signal<Comment[]>([]);
  listOfComments = signal<Comment[]>([]);
  private pendingLikes = new Set<number>();
  private pendingDislikes = new Set<number>();
  private readonly MIN_TIME_TO_LIKE_DISLIKE: number = 1000;
  public numberOfResponses(idComment: number): number {
    const replies = this.listOfReplies();
    return replies.filter((comment: Comment) => comment.reply_to_id === idComment).length;
  }
  public createComment(commentary: string, publicationId: number): Observable<any> {
    return this.http.post(config.api.URL_BACKEND + '/comment/new-comment', {
      'comment': commentary,
      'publicationId': publicationId
    });
  }

  public updateListOfReplies(comment: Comment): void {
    this.listOfReplies.update((data: any) => {
      return [...data, comment];
    });
  }
  public replyComment(comment: string, commentaryId: number, publicationId: number): Observable<any> {
    return this.http.post(config.api.URL_BACKEND + '/comment/reply-comment', { comment, commentaryId, publicationId });
  }

  public addLikeComment(commentId: number, isReply = false): void {
    if (this.pendingLikes.has(commentId)) return;
    this.pendingLikes.add(commentId);
    this.listOfComments.update((comments: Comment[]) => {
      return comments.map((comment: Comment) => {
        if (comment.id == commentId) {
          comment.likes.push({user_id : this.authService.userData().id});
          comment.is_liked = true;
        }
        return comment;
      });
    });
    if(isReply) {
      this.listOfReplies.update((comments: Comment[]) => {
        return comments.map((comment: Comment) => {
          if (comment.id == commentId) {
            comment.likes.push({user_id : this.authService.userData().id});
            comment.is_liked = true;
          }
          return comment;
        });
      });

    }
    setTimeout(() => {
      this.http.post(config.api.URL_BACKEND + '/comment/like', { 'commentaryId': commentId }).subscribe({
        next: (data) => {
          this.pendingLikes.delete(commentId);
        },
        error: (error) => {
          this.pendingLikes.delete(commentId);
          debugger;
          if (error.status == 400 && error.error.message == "You have already liked this commentary") {
            this.removeLikeComment(commentId);
          }
        }
      });
    }, this.MIN_TIME_TO_LIKE_DISLIKE);


  }

  public removeLikeComment(commentId: number, isReply = false): void {
    if (this.pendingLikes.has(commentId)) return;
    this.pendingDislikes.add(commentId);
    this.listOfComments.update((comments: Comment[]) => {
      return comments.map((comment: Comment) => {
        if (comment.id == commentId) {
          comment.likes  = comment.likes.filter((like: any) => like.user_id != this.authService.userData().id);
          comment.is_liked = false;
        }
        return comment;
      });
    });
    if(isReply) {
      this.listOfReplies.update((comments: Comment[]) => {
        return comments.map((comment: Comment) => {
          if (comment.id == commentId) {
            comment.likes  = comment.likes.filter((like: any) => like.user_id != this.authService.userData().id);
            comment.is_liked = false;
          }
          return comment;
        });
      });

    }
    setTimeout(() => {
      this.http.post(config.api.URL_BACKEND + '/comment/unlike', { 'commentaryId': commentId }).subscribe({
        next: (data) => {
          this.pendingDislikes.delete(commentId);
          console.log(data);
        },
        error: (error) => {
          this.pendingDislikes.delete(commentId);
          if (error.status == 400 && error.error.message == "You have already unliked this commentary") {
            this.addLikeComment(commentId);
          }
        }
      });
    }, this.MIN_TIME_TO_LIKE_DISLIKE);
  }


  public getCommentaryByPublicationId(publicationId: number): void {
    this.http.get(config.api.URL_BACKEND + '/comment/get-commentaries/' + publicationId).subscribe({
      next: (response: any) => {
        this.listOfComments.set(response.data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  public cleanListOfComments(): void {
    this.listOfComments.set([]);
  }
}
