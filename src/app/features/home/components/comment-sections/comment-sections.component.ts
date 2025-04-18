import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AddCommentInputComponent } from '../add-comment-input/add-comment-input.component';
import { HomeService } from '../../services/home/home.service';

@Component({
  selector: 'app-comment-sections',
  imports: [AddCommentInputComponent],
  templateUrl: './comment-sections.component.html',
  styleUrl: './comment-sections.component.less'
})
export class CommentSectionsComponent implements OnInit {
  @Input() dataModal: any;

  constructor(public homeService:HomeService) { }
  ngOnInit(): void {
    console.log(this.dataModal);

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
}
