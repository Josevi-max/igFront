import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStoreService {

  private isLoading: WritableSignal<boolean> = signal(false);

  public getIsLoading(): Signal<boolean> {
    return this.isLoading;
  }

  public setIsLoading(value: boolean): void {
    this.isLoading.set(value);
  }
}
