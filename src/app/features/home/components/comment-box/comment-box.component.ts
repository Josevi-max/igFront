import { Component, Input, input } from '@angular/core';
import { CommentaryService } from '../../services/commment/commentary.service';
import { HomeService } from '../../services/home/home.service';
import { Comment } from '../../models/comments/comment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-box',
  imports: [CommonModule],
  templateUrl: './comment-box.component.html',
  styleUrl: './comment-box.component.less'
})
export class CommentBoxComponent {
  @Input() dataComment?: Comment;
  @Input() idModal: number = -1;
  @Input() isAReply: boolean = false;
  constructor(public commentaryService: CommentaryService, public homeService: HomeService) { }

  addIdToReply(dataComment: Comment, idPublication: number): void {
    if(dataComment.reply_to_id != null) {
      this.commentaryService.idCommentWeAreReplying.set(dataComment.reply_to_id);
    }else{
      this.commentaryService.idCommentWeAreReplying.set(dataComment.id);
    }
    let valueTextArea = document.getElementById(`commentModal${idPublication}`) as HTMLInputElement;
    valueTextArea.value = `@${dataComment.user.username} `;
    valueTextArea.focus();
  }
}
