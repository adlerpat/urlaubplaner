import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(private hotToastService: HotToastService) { }

  public infoToast(message: string) {
    this.hotToastService.show('<i class="pi pi-info-circle" style="font-size: 2rem;"></i>&nbsp;' + message, {
      duration: 3000,
      style: {
        border: '2px solid var(--bluegray-500)',
        padding: '16px',
        color: 'var(--bluegray-900)',
      },
    });
  }
}
