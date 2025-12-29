import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStoreService {

  private isLoading: WritableSignal<boolean> = signal(false);
  private showEmoyiPicker: WritableSignal<boolean> = signal(false);

  public getShowEmoyiPicker(): Signal<boolean> {
    return this.showEmoyiPicker;
  }

  public getIsLoading(): Signal<boolean> {
    return this.isLoading;
  }

  public setIsLoading(value: boolean): void {
    this.isLoading.set(value);
  }

  public setShowEmoyiPicker(value: boolean): void {
    this.showEmoyiPicker.set(value);
  }
}
