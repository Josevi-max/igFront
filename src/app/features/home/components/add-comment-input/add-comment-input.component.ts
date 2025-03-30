import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, input, OnChanges, OnInit, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { HomeService } from '../../services/home/home.service';
import { CommentaryService } from '../../services/commment/commentary.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { Publication } from '../../models/publications/publication';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-comment-input',
  imports: [SpinnerComponent,FormsModule],
  templateUrl: './add-comment-input.component.html',
  styleUrl: './add-comment-input.component.less',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddCommentInputComponent implements OnChanges{
  constructor(private homeService: HomeService, private commentaryService: CommentaryService, public authService: AuthService) { }
  @Input() cardData: any;
  @Input() isModalSection: boolean = false;
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
  addEmoji(idComment: number, event: any) {
    let textarea = document.getElementById(`commentModal${idComment}`) as HTMLInputElement;

    if(!this.isModalSection){
      textarea = document.getElementById(`comment${idComment}`) as HTMLInputElement;
    }
    const submitButton = textarea.nextElementSibling;
    textarea.style.width = '380px';
    submitButton?.classList.remove('d-none')
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.value += event.detail.unicode;
  }
  showEmojiClicker(idEmoyi: number) {
    debugger;
    let emoyiPicker = document.getElementById(`emoyiPickerComponent${idEmoyi}`) as HTMLInputElement;
    if(this.isModalSection){
      emoyiPicker = document.getElementById(`emoyiPickerComponentModal${idEmoyi}`) as HTMLInputElement;
    }
    document.querySelectorAll('.emoyiPicker').forEach(el => el.classList.add('d-none'));
    if (emoyiPicker?.classList.contains('d-none')) {
      emoyiPicker?.classList.remove('d-none');
    }
  }

  createComment(event: Event,idPublication: number) {
    event.preventDefault();
    let valueTextArea = document.getElementById(`commentModal${idPublication}`) as HTMLInputElement;
    if(!this.isModalSection){
      valueTextArea = document.getElementById(`comment${idPublication}`) as HTMLInputElement;
    }
    debugger;
    if (valueTextArea.value != '') {
      this.loadingNewComment(true, idPublication);
      debugger;
      this.commentaryService.createComment(valueTextArea.value, idPublication).subscribe({
        next: (response) => {
          this.loadingNewComment(false, idPublication);
          this.updateDataSignal(idPublication, valueTextArea.value);
          valueTextArea.value = '';
        },
        error: (error) => {
          console.error('Error al crear el comentario:', error);
        }
      });
    }
  }
  loadingNewComment(showSpinner: boolean, idCard: number) {
    let form = document.getElementById(`formComment${idCard}`) as HTMLInputElement;
    if(this.isModalSection){
      form = document.getElementById(`formCommentModal${idCard}`) as HTMLInputElement;
    }
    debugger;
    if (showSpinner) {
      form.classList.add('opacity-50');
      form.nextElementSibling?.classList.remove('d-none');
    } else {
      form.classList.remove('opacity-50');
      form.nextElementSibling?.classList.add('d-none');
    }
  }
  updateDataSignal(idPublication: number, valueTextArea: string) {
    this.homeService.data.update((dataPublication: any[]) => {
      // Buscar la publicación a modificar
      const publication = dataPublication.find(p => p.id === idPublication);
      
      if (publication) {
        // Agregar comentario directamente sin cambiar la referencia del array
        publication.comments.push({
          'commentary': valueTextArea,
          'created_at': new Date().toISOString(),
          'user_id': this.authService.userData().id,
          'publication_id': idPublication,
          'updated_at': new Date().toISOString(),
          'id': Date.now(),
          'user': { ...this.authService.userData() }
        });
      }
  
      return dataPublication; // Mantener la misma referencia del array
    });
  }
  
  resizeTextArea(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    const submitButton = textarea.nextElementSibling;
    debugger;
    if (textarea.value != '') {
      //textarea.style.width = '380px';
      submitButton?.classList.remove('d-none')
      textarea.style.height = textarea.scrollHeight + "px";
    } else {
      textarea.style.width = '100%';
      submitButton?.classList.add('d-none');
      textarea.style.height = '25px';
    }
  }
}
