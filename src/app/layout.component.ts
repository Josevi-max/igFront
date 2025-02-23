import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-layout',
  imports: [RouterModule,HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export class LayoutComponent {

}
