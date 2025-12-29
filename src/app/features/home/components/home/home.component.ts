import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { CommentSectionsComponent } from '../comment-sections/comment-sections.component';
import { AddCommentInputComponent } from '../add-comment-input/add-comment-input.component';
import { AuthManagementService } from '../../../../core/state/auth/store/auth-management.service';
import { PublicationsFacadeService } from '../../../publications/state/facade/publications-facade.service';
import { Publication } from '../../../publications/domain/models/publication';
import { PublicationsStoreService } from '../../../publications/state/store/publications-store.service';
import { UiStoreService } from '../../../../core/state/ui/store/ui-store.service';
import { PublicationsService } from '../../../publications/domain/services/publications.service';

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
export class HomeComponent {

  public expandedPublications = new Set<number>();

  private readonly publicationsFacadeService = inject(PublicationsFacadeService);
  private readonly publicationsStoreService = inject(PublicationsStoreService);
  private readonly publicationsService = inject(PublicationsService);
  private readonly authManagementService = inject(AuthManagementService);
  private readonly uiStoreService = inject(UiStoreService);

  public get usernameAuthUser(): string | undefined {
    return this.authManagementService.userDataValue()?.username;
  }

  public get listPublications(): Signal<Publication[]> {
    return this.publicationsStoreService.publications;
  }

  public calculateNumberOfDaysFromPublication(dateString: string): number {
    return this.publicationsService.calculateNumberDaysFromPublication(dateString);
  }

  public addLikePublication(publicationId: number): void {
    this.publicationsFacadeService.addLikePublication(publicationId);
  }

  public removeLikePublication(publicationId: number): void {
    this.publicationsFacadeService.removeLikePublication(publicationId);
  }

  public hideAllEmoyiPickers():void {
    this.uiStoreService.setShowEmoyiPicker(false);
  }

  public showMoreTextButton(description: string):boolean {
    let result = false
    const MIN_LENGTH_DESCRIPTION = 143;
    if (description.length > MIN_LENGTH_DESCRIPTION) {
      result = true;
    }
    return result;
  }

  public isExpanded(id: number): boolean {
    return this.expandedPublications.has(id);
  }

  public toggleDescription(id: number): void {
    if (this.expandedPublications.has(id)) {
      this.expandedPublications.delete(id);
    } else {
      this.expandedPublications.add(id);
    }
  }

  myComments(comments: any) {
    //TO-DO pendiente refactorizar
    var myComments: any = [];
    if (comments.length > 0) {
      for (let index = (comments.length - 1); index > 0; index--) {
        const comment = comments[index];
        if (comment.user_id == this.authManagementService.userDataValue()?.id && myComments.length < 3) {
          myComments.unshift(comment.commentary);
        }
      }
    }
    return myComments;
  }

}