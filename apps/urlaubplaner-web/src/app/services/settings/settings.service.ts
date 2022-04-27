import { Injectable, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { ModalDialogService } from 'ngx-modal-dialog';
import { MenuEvents } from '../../core/menu/menu.component';
import { SettingsComponent } from '../../core/settings/settings.component';
import { holidayOptionsHelper } from './settings-options.helper';

/** interface to help deal with holiday options in holiday settings */
export interface HolidayOption {
  shortHand: string;
  state: string;
}
/**
 * global settings service
 * spawns modals and receives back data
 * uses received data to modify settings e.g. which state holidays are shown
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  /** which states are possible to filter for holidays */
  private _possibleHolidayOptions: HolidayOption[] = holidayOptionsHelper;

  /**
   *
   * @param modalService injected to be able to spawn modal dialogs
   * @param router injected to modify route queryparams on settings change
   * @param activatedRoute injected to get current route for router setting queryparams
   * @param logger injected to log important events
   */
  constructor(
    private modalService: ModalDialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: NGXLogger
  ) {}

  /** expose possible states filters for holidays */
  get possibleHolidayOptions(): HolidayOption[] {
    return this._possibleHolidayOptions;
  }

  /** open settings modal with depending setting site target
   * @param $event which settings are targeted
   * @param viewContainerRef where to spawn the modal
   */
  public openSettings($event: MenuEvents, viewContainerRef: ViewContainerRef) {
    this.logger.debug('SettingsService.openSettings called for ' + $event);
    this.modalService.openDialog(viewContainerRef, {
      title: 'Settings',
      childComponent: SettingsComponent,
      data: $event,
    });
  }
  /**
   * sets the states holiday filter config in queryparams of route, automatically picked up by holidays service
   * @param states which states are filtered
   */
  public setHolidayConfig(states: string[]) {
    this.logger.debug('SettingsService.setHolidayConfig called for ' + states);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        states: states.toString().toLowerCase(),
      },
      queryParamsHandling: 'merge',
    });
  }
}
