import { Component, inject, signal, Signal } from '@angular/core';
import { UiStoreService } from '../../core/state/ui/store/ui-store.service';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.less'
})
export class SpinnerComponent {

  public isLoading: Signal<boolean> = signal(false);
  private readonly uiStoreService = inject(UiStoreService);

  constructor() {
    this.isLoading = this.uiStoreService.getIsLoading();
  }
}
