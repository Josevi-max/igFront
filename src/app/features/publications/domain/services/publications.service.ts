import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  public calculateNumberDaysFromPublication(dateString: string): number {
    const publicationDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - publicationDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  }
}
