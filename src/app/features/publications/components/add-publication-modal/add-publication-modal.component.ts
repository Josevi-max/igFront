import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CancelPublicationComponent } from "../cancel-publication/cancel-publication.component";
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-add-publication-modal',
  imports: [CommonModule, FormsModule, CancelPublicationComponent],
  templateUrl: './add-publication-modal.component.html',
  styleUrl: './add-publication-modal.component.less'
})
export class AddPublicationModalComponent implements AfterViewInit  {

  selectedImageUrl: string | ArrayBuffer | null = null;

  private discardModal!: Modal;

  ngAfterViewInit() {
    // instanciamos el modal UNA sola vez
    const el = document.getElementById('discardPublication')!;
    this.discardModal = new Modal(el, {
      backdrop: true,
      keyboard: true,
      focus: true
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImageUrl = reader.result;
      };

    reader.readAsDataURL(file);
    }
  }

  openDiscardPublicationModal() {
    this.discardModal.show();
    (this.discardModal as any)._element.style.zIndex = '1065';
  }
}
