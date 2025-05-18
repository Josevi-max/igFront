import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cancel-publication',
  imports: [],
  templateUrl: './cancel-publication.component.html',
  styleUrl: './cancel-publication.component.less'
})
export class CancelPublicationComponent {

  @Output() discardPublication= new EventEmitter<string>();

  discard(){
    this.discardPublication.emit('');
  }
}
