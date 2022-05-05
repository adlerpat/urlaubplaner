import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

/**
 * service to make dealing with hot toasts easier
 */
@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  /**
   * currently only provides injections
   * @param hotToastService injected to spawn toast messages
   */
  constructor(private hotToastService: HotToastService) { }

  /**
   * spawns info toast profile with message
   * @param message the message that should be toasted
   */
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
