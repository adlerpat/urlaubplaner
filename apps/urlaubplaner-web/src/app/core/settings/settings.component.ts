import { Component, ComponentRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IModalDialog,
  IModalDialogButton,
  IModalDialogOptions,
} from 'ngx-modal-dialog';
import { BehaviorSubject } from 'rxjs';
import {
  HolidayOption,
  SettingsService,
} from '../../services/settings/settings.service';
import { MenuEvents } from '../menu/menu.component';

/**
 * settings component spawned as modal by settings service
 * communicates back to settings service only on close
 */
@Component({
  selector: 'urlaubplaner-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements IModalDialog {
  /** actionbuttons used by Interface IModalDialog, configured in constructor */
  private actionButtons: IModalDialogButton[];
  /** temp storage of view child settings data, send to settings service before close  */
  private settingsData: any;
  /** tracker of holiday options that have been selected */
  private _selectedHolidayOptions$: BehaviorSubject<string[]> =
    new BehaviorSubject<string[]>([]);

  /** which settings have been opened -> spawns depending view child */
  @Input() settingsMode!: MenuEvents;

  /**
   * sets actionbuttons for modal interface and subscribes to queryparams for selectedholidayoptions behavioursubject
   * @param settingsService injected to configure settings through global service
   * @param activatedRoute injected to get route params
   */
  constructor(
    private settingsService: SettingsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.actionButtons = [
      { text: 'Close', onAction: () => true, buttonClass: "btn btn-danger" },
      { text: 'Confirm', onAction: () => this.confirmDataOnClose(), buttonClass: "btn btn-success" },
    ];
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params['states']) {
          this._selectedHolidayOptions$.next(
            (params['states'] as string).toUpperCase().split(',')
          );
        }
      },
    });
  }

  /** expose possible holidayOptions from settingsService to template  */
  get holidayOptions(): HolidayOption[] {
    return this.settingsService.possibleHolidayOptions;
  }
  /** expose selected holidayoptions subject to template for viewchild holiday settings*/
  get selectedHolidayOptions$(): BehaviorSubject<string[]> {
    return this._selectedHolidayOptions$;
  }
  /** needed by interface, makes passed input data available */
  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.settingsMode = options.data as MenuEvents;
  }
  /** general data receiver method for viewchild data output */
  handleDataFromSettingsEvent(data: any) {
    this.settingsData = data;
  }
  /** handles close event by passing data received from view childs to depending settingsService method */
  confirmDataOnClose(): boolean {
    switch (this.settingsMode) {
      case 'settingsHolidays':
        this.settingsService.setHolidayConfig(this.settingsData);
        return true;
        break;

      default:
        return true;
        break;
    }
  }
}
