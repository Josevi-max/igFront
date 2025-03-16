import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnInit, signal } from '@angular/core';
import { Route } from '@angular/router';
import { HomeService } from '../../services/home/home.service';
import { CommonModule } from '@angular/common';
import { catchError, Observable } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentaryService } from '../../services/commment/commentary.service';
import { Publication } from '../../models/publications/publication';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { CommentSectionsComponent } from '../comment-sections/comment-sections.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    SpinnerComponent,
    CommentSectionsComponent,
    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService, private commentaryService: CommentaryService, public authService: AuthService) { }

  hideAllEmoyiPickers(event: Event){
    if ((event.target as HTMLElement).closest('.emoyiPicker, .buttonToShowEmoyi, .textAreaInput')) {
      return;
    }
    document.querySelectorAll('.emoyiPicker').forEach(el => el.classList.add('d-none'));
  }
  addEmoji(idComment:number,event:any){
    let textarea = document.getElementById(`comment${idComment}`) as HTMLInputElement;
    const submitButton = textarea.nextElementSibling;
    textarea.style.width = '380px';
    submitButton?.classList.remove('d-none')
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.value += event.detail.unicode;
  }
  showEmojiClicker(idEmoyi:number) {
    let emoyiPicker = document.getElementById(`emoyiPicker${idEmoyi}`) as HTMLInputElement;
    document.querySelectorAll('.emoyiPicker').forEach(el => el.classList.add('d-none'));
    if(emoyiPicker?.classList.contains('d-none')){
      emoyiPicker?.classList.remove('d-none');
    }
  }

  createComment(idPublication: number) {
    debugger;
    const valueTextArea = document.getElementById(`comment${idPublication}`) as HTMLInputElement;
    if (valueTextArea.value != '') {
      this.loadingNewComment(true, idPublication);
      this.commentaryService.createComment(valueTextArea.value, idPublication).subscribe(
        (response) => {

          this.loadingNewComment(false, idPublication);
          this.updateDataSignal(idPublication,valueTextArea.value);
          valueTextArea.value = '';
        },
        (error) => {
          console.error('Error al crear el comentario:', error);
        }
      )
    }
  }

  updateDataSignal(idPublication: number, valueTextArea: string) {
    this.data.update((dataPublication: Publication[]) => {
      return dataPublication.map(publication => {
        if (publication.id === idPublication) {
          let commentsPublication = publication['comments'];
          commentsPublication.push(
            {
              'commentary': valueTextArea,
              'created_at': new Date().toISOString(),
              'user_id': this.authService.userData().id,
              'publication_id': idPublication,
              'updated_at': new Date().toISOString(),
              'id': Date.now()
            }
          );
          return { ...publication, comments: commentsPublication };
        }
        return publication;
      });
    });
  }

  loadingNewComment(showSpinner: boolean, idCard: number) {
    const form = document.getElementById(`formComment${idCard}`) as HTMLInputElement;
    if (showSpinner) {
      form.classList.add('opacity-50');
      form.nextElementSibling?.classList.remove('d-none');
    } else {
      form.classList.remove('opacity-50');
      form.nextElementSibling?.classList.add('d-none');
    }
  }

  myComments(comments: any) {
    var myComments: any = [];
    if (comments.length > 0) {
      for (let index = (comments.length - 1); index > 0; index--) {
        const comment = comments[index];
        if (comment.user_id == this.authService.userData().id && myComments.length < 3) {
          myComments.unshift(comment.commentary);
        }
      }
    }

    return myComments;
  }

  data = signal<Publication[]>([]);
  ngOnInit(): void {
    this.homeService.getListPublications(1).subscribe(
      (response) => {
        debugger;
        console.log(response.response.data);
        this.data.set(response.response.data);
      }
    )
  }


  getNumberDays(date: string) {

    let msDay = (1000 * 60 * 60 * 24);

    let dateMs = new Date(date).getTime();

    let diff = Date.now() - dateMs;

    let diffDays = Math.ceil(diff / msDay);

    let result = diffDays + ' días';

    let diffHours = -1;

    let diffMins = -1;

    if (diffDays < 1) {
      diffHours = Math.round((diff / (1000 * 60 * 60)));
      result = diffHours + ' h';
    }

    if (diffHours == 0) {
      diffMins = Math.floor((diff / (1000 * 60)));
      result = diffMins + ' m';
    }

    return result;
  }

  showMoreTextButton(description: string) {
    let result = false
    if (description.length > 143) {
      result = true;
    }
    return result;
  }

  showHidedText(idElementToHide: number, event: MouseEvent) {
    const element = event.target as HTMLElement;
    document.getElementById('descriptionPublication' + idElementToHide)?.classList.remove('card-text');
    element.classList.add('d-none');
  }

  resizeTextArea(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    const submitButton = textarea.nextElementSibling;
    if (textarea.value != '') {
      textarea.style.width = '380px';
      submitButton?.classList.remove('d-none')
      textarea.style.height = textarea.scrollHeight + "px";
    } else {
      textarea.style.width = '100%';
      submitButton?.classList.add('d-none');
      textarea.style.height = '25px';
    }
  }
}
