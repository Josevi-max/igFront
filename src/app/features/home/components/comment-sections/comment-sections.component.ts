import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { AddCommentInputComponent } from '../add-comment-input/add-comment-input.component';
import { HomeService } from '../../services/home/home.service';
import { CommentaryService } from '../../services/commment/commentary.service';
import { Comment } from '../../models/comments/comment';
import { CommentBoxComponent } from '../comment-box/comment-box.component';

@Component({
  selector: 'app-comment-sections',
  imports: [AddCommentInputComponent,JsonPipe,CommentBoxComponent],
  templateUrl: './comment-sections.component.html',
  styleUrl: './comment-sections.component.less'
})
export class CommentSectionsComponent implements OnInit {
  @Input() dataModal: any;

  constructor(public homeService:HomeService,public commentaryService:CommentaryService) { }
  ngOnInit(): void {
    console.log(this.dataModal);
    this.dataModal['comments'].forEach((comment:Comment) => {
      if(comment.reply_to_id != null) {
        this.commentaryService.idCommentsWithReply.update((data:any) => {
          return [...data, comment.reply_to_id];
        });
        this.commentaryService.updateListOfReplies(comment);
      }
    });
    function resizeModal(): void {
      const modals = document.querySelectorAll<HTMLElement>('.modal-dialog');
      let valueToIndrease = 500;

      const screenHeight = window.innerHeight + valueToIndrease;

      if (modals) {
        modals.forEach((modal) => {
          modal.style.setProperty('--bs-modal-width', `${screenHeight}px`);
        });

      }
    }
    resizeModal();
    window.addEventListener('resize', resizeModal);
  }

  addIdToReply(dataComment: Comment,idPublication:number): void {
    this.commentaryService.idCommentWeAreReplying.set(dataComment.id);
    let valueTextArea = document.getElementById(`commentModal${idPublication}`) as HTMLInputElement;
    valueTextArea.value = `@${dataComment.user.username} `;
    valueTextArea.focus();
  }

  seeResponses(idComment:number):void{
    let element = document.getElementById(`seeResponses${idComment}`) as HTMLInputElement;
    if(element.innerText == 'Ver respuestas ('+ this.commentaryService.numberOfResponses(idComment)+')'){
      element.innerText = 'Ocultar respuestas';

      document.getElementById(`replies${idComment}`)?.classList.remove('d-none');


    }else{
      element.innerText = 'Ver respuestas ('+ this.commentaryService.numberOfResponses(idComment)+')';
      document.getElementById(`replies${idComment}`)?.classList.add('d-none');

    }
  }
}
