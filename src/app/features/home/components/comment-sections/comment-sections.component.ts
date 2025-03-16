import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-comment-sections',
  imports: [JsonPipe],
  templateUrl: './comment-sections.component.html',
  styleUrl: './comment-sections.component.less'
})
export class CommentSectionsComponent implements OnInit{
  @Input() dataModal:any;

  ngOnInit(): void {
    console.log(this.dataModal);
  }
}
