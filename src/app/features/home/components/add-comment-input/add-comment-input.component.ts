import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, input, OnChanges, OnInit, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { HomeService } from '../../services/home/home.service';
import { CommentaryService } from '../../services/commment/commentary.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { Publication } from '../../models/publications/publication';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../models/comments/comment';

@Component({
  selector: 'app-add-comment-input',
  imports: [SpinnerComponent, FormsModule],
  templateUrl: './add-comment-input.component.html',
  styleUrl: './add-comment-input.component.less',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddCommentInputComponent implements OnChanges {
  constructor(private homeService: HomeService, private commentaryService: CommentaryService, public authService: AuthService) { }
  @Input() cardData: any;
  @Input() isModalSection: boolean = false;
  @Input() isReply: boolean = false;
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
  addEmoji(idComment: number, event: any) {
    let textarea = document.getElementById(`commentModal${idComment}`) as HTMLInputElement;

    if (!this.isModalSection) {
      textarea = document.getElementById(`comment${idComment}`) as HTMLInputElement;
    }
    const submitButton = textarea.nextElementSibling;
    textarea.style.width = '380px';
    submitButton?.classList.remove('d-none')
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.value += event.detail.unicode;
  }
  showEmojiClicker(idEmoyi: number) {
    let emoyiPicker = document.getElementById(`emoyiPickerComponent${idEmoyi}`) as HTMLInputElement;
    if (this.isModalSection) {
      emoyiPicker = document.getElementById(`emoyiPickerComponentModal${idEmoyi}`) as HTMLInputElement;
    }
    document.querySelectorAll('.emoyiPicker').forEach(el => el.classList.add('d-none'));
    if (emoyiPicker?.classList.contains('d-none')) {
      emoyiPicker?.classList.remove('d-none');
    }
  }

  createComment(event: Event, idPublication: number) {
    event.preventDefault();
    let valueTextArea = document.getElementById(`commentModal${idPublication}`) as HTMLInputElement;
    if (!this.isModalSection) {
      valueTextArea = document.getElementById(`comment${idPublication}`) as HTMLInputElement;
    }
    if (valueTextArea.value != '') {
      this.loadingNewComment(true, idPublication);
      if (this.commentaryService.idCommentWeAreReplying() != -1) {
        this.replyComment(valueTextArea.value, idPublication);
      } else {
        this.commentaryService.createComment(valueTextArea.value, idPublication).subscribe({
          next: (response) => {
            this.loadingNewComment(false, idPublication);
            if(this.commentaryService.idCommentWeAreReplying() == -1) {
              response.data.user = this.authService.userData();
              this.updateDataSignal(idPublication, response.data);
            }
            valueTextArea.value = '';
          },
          error: (error) => {
            console.error('Error al crear el comentario:', error);
          }
        });
      }

    }
  }
  loadingNewComment(showSpinner: boolean, idCard: number) {
    let form = document.getElementById(`formComment${idCard}`) as HTMLInputElement;
    if (this.isModalSection) {
      form = document.getElementById(`formCommentModal${idCard}`) as HTMLInputElement;
    }
    if (showSpinner) {
      form.classList.add('opacity-50');
      form.nextElementSibling?.classList.remove('d-none');
    } else {
      form.classList.remove('opacity-50');
      form.nextElementSibling?.classList.add('d-none');
    }
  }
  updateDataSignal(idPublication: number, dataCommentary: Comment) {
    this.homeService.data.update((dataPublication: any[]) => {
      const publication = dataPublication.find(p => p.id === idPublication);

      if (publication) {
        publication.comments.push(dataCommentary);
        this.commentaryService.listOfComments.update((data: any) => {
          return [...data, dataCommentary];
        });
      }

      return dataPublication;
    });
  }

  resizeTextArea(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    const submitButton = textarea.nextElementSibling;
    if (textarea.value != '') {
      submitButton?.classList.remove('d-none');
      submitButton?.classList.remove('isInModal');
      textarea.style.height = textarea.scrollHeight + "px";
    } else {
      textarea.style.width = '100%';
      if (this.isModalSection) {
        submitButton?.classList.add('isInModal');
      } else {
        submitButton?.classList.add('d-none');
      }
      textarea.style.height = '25px';
    }
  }
  replyComment(comment: string, idPublication: number): void {
    this.commentaryService.replyComment(comment, this.commentaryService.idCommentWeAreReplying(),idPublication).subscribe({
      next: (response) => {
        this.loadingNewComment(false, idPublication);
        let valueTextArea = document.getElementById(`commentModal${idPublication}`) as HTMLInputElement;
        response.data.user = this.authService.userData();
        this.commentaryService.updateListOfReplies(response.data);
        this.commentaryService.listOfComments.update((data: any) => {
          return [...data, response.data];
        });
        this.commentaryService.idCommentsWithReply.update((data:any) => {
          return [...data, this.commentaryService.idCommentWeAreReplying()];
        });
        this.commentaryService.idCommentWeAreReplying.set(-1);
        valueTextArea.value = '';
      },
      error: (error) => {
        console.error('Error al crear la replica del comentario:', error);
      }

    })
  }
}
