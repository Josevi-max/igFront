import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { AddPublicationModalComponent } from './features/new-publication/components/add-publication-modal/add-publication-modal.component';

@Component({
  selector: 'app-layout',
  imports: [RouterModule,HeaderComponent,AddPublicationModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export class LayoutComponent {

}
