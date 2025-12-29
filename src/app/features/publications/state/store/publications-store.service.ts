import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Publication } from '../../domain/models/publication';

@Injectable({
  providedIn: 'root'
})
export class PublicationsStoreService {

  private publicationsData:WritableSignal<Publication[]> = signal([]);
  private pendingLikes: WritableSignal<number> = signal(0);
  private pendingDislikes: WritableSignal<number> = signal(0);

  get publications(): Signal<Publication[]> {
    return this.publicationsData;
  }

  get likesInProgress(): Signal<number> {
    return this.pendingLikes;
  }

  get dislikesInProgress(): Signal<number> {
    return this.pendingDislikes;
  }

  public setPublications(publications: Publication[]): void {
    this.publicationsData.set(publications);
  }

  public incrementLikesInProgress(): void {
    this.pendingLikes.update((current) => current + 1);
  }

  public decrementLikesInProgress(): void {
    this.pendingLikes.update((current) => {
      if (current > 0) {
        return current - 1;
      }
      return current;
    });
  }

  public incrementDislikesInProgress(): void {
    this.pendingDislikes.update((current) => current + 1);
  }

  public decrementDislikesInProgress(): void {
    this.pendingDislikes.update((current) => {
      if (current > 0) {
        return current - 1;
      }
      return current;
    });
  }

  public incrementDecrementLikesPublication(publicationId: number, increment: boolean): void {
    this.publicationsData.update((publications) => {
      return publications.map((publication) => {
        if (publication.id === publicationId) {
          return {
            ...publication,
            likes: increment ? publication.likes + 1 : publication.likes - 1,
            liked_by_auth_user: increment ? true : false
          };
        }
        return publication;
      });
    });
  }
}
