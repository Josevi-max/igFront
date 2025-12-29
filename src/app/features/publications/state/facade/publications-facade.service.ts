import { inject, Injectable } from '@angular/core';
import { PublicationsApiService } from '../../infrastructure/api/publications-api.service';
import { PublicationsStoreService } from '../store/publications-store.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsFacadeService {

  private readonly publicationsApiService = inject(PublicationsApiService);
  private readonly publicationsStoreService = inject(PublicationsStoreService);
  private readonly MIN_TIME_TO_LIKE_DISLIKE: number = 1000;

  public getListPublications(page: number): void {
    this.publicationsApiService.getListPublications(page).pipe(take(1)).subscribe({
      next: (response) => {
        this.publicationsStoreService.setPublications(response.response.data);
      }
    });
  }

  public addLikePublication(publicationId: number): void {
    if (this.publicationsStoreService.likesInProgress() > 0) return;
    this.publicationsStoreService.incrementLikesInProgress();
    this.publicationsStoreService.incrementDecrementLikesPublication(publicationId, true);

    setTimeout(() => {
      this.publicationsApiService.likePublication(publicationId).pipe(take(1)).subscribe(
        {
          next: () => {
            this.publicationsStoreService.decrementLikesInProgress();
          },
          error: (error) => {
            this.publicationsStoreService.decrementLikesInProgress();
            if (error.status === 400) {
              this.removeLikePublication(publicationId);
            }

          }
        }
      );
    }, this.MIN_TIME_TO_LIKE_DISLIKE);
  }

  public removeLikePublication(publicationId: number): void {
    if (this.publicationsStoreService.dislikesInProgress() > 0) return;
    this.publicationsStoreService.incrementDislikesInProgress();
    this.publicationsStoreService.incrementDecrementLikesPublication(publicationId, false);

    setTimeout(() => {
      this.publicationsApiService.removeLikePublication(publicationId).pipe(take(1)).subscribe(
        {
          next: () => {
            this.publicationsStoreService.decrementDislikesInProgress();
          },
          error: (error) => {
            this.publicationsStoreService.decrementDislikesInProgress();
            if (error.status === 400) {
              this.addLikePublication(publicationId);
            }
          }
        }
      );
    }, this.MIN_TIME_TO_LIKE_DISLIKE);
  }
}