import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-list-friends',
  imports: [],
  templateUrl: './list-friends.component.html',
  styleUrl: './list-friends.component.less'
})
export class ListFriendsComponent {

  constructor(public auth:AuthService){

  }

  
}
