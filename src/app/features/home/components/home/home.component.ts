import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnInit, signal } from '@angular/core';
import { Route } from '@angular/router';
import { HomeService } from '../../services/home/home.service';
import { CommonModule } from '@angular/common';
import { catchError, Observable, take } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentaryService } from '../../services/commment/commentary.service';
import { Publication } from '../../models/publications/publication';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { CommentSectionsComponent } from '../comment-sections/comment-sections.component';
import { AddCommentInputComponent } from '../add-comment-input/add-comment-input.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    SpinnerComponent,
    CommentSectionsComponent,
    AddCommentInputComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {

  constructor(public homeService: HomeService, private commentaryService: CommentaryService, public authService: AuthService) { }

  hideAllEmoyiPickers(event: Event) {
    if ((event.target as HTMLElement).closest('.emoyiPicker, .buttonToShowEmoyi, .textAreaInput')) {
      return;
    }
    document.querySelectorAll('.emoyiPicker').forEach(el => el.classList.add('d-none'));
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


  ngOnInit(): void {
    this.homeService.getListPublications(1).pipe(
      take(1)
    ).subscribe(
      (response) => {
        debugger;
        console.log(response.response.data);
        this.homeService.data.set(response.response.data);
      }
    )
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

}