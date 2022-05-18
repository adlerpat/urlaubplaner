import { Component, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogButton, IModalDialogOptions } from 'ngx-modal-dialog';
import { contextMenuType } from '../../planner/monthview/monthview.component';
import { VacationService } from '../../services/vacation/vacation.service';

/** interface to make dealing with the picker values easier */
export interface eventpickerOptions {
  /** starting date of the option */
  startingDate: Date,
  /** ending date of the option */
  endingDate: Date,
  /** eventtype of the event to be created */
  eventType: contextMenuType
}

/** component used to create a new calendar event */
@Component({
  selector: 'urlaubplaner-eventpicker',
  templateUrl: './eventpicker.component.html',
  styleUrls: ['./eventpicker.component.scss'],
})
export class EventpickerComponent implements IModalDialog {
  /** actionbuttons used by Interface IModalDialog, configured in constructor */
  private actionButtons: IModalDialogButton[];
  /** the event type that the created event is going to have */
  private eventType: contextMenuType = "vacation";
  /** date range for usage in picker */
  public rangeDates: Date[] = [];

  /**
   * sets actionbutttons config and provides injections
   * @param vacationService injected to be able to add a vacation event
   */
  constructor(private vacationService: VacationService) {
    this.actionButtons = [
      { text: 'Close', onAction: () => true, buttonClass: "btn btn-danger" },
      { text: 'Confirm', onAction: () => this.createAndClose(), buttonClass: "btn btn-success" },
    ];
  }
  
  /** needed by interface, makes passed input data available */
  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    console.log(options);
    this.rangeDates[0] = (options.data as eventpickerOptions).startingDate;
    this.rangeDates[1] = (options.data as eventpickerOptions).endingDate;
    this.eventType = (options.data as eventpickerOptions).eventType;
  }
  /** handles close event by passing data to vacationService method with depending vacation type */
  createAndClose(): boolean {
    this.rangeDates[1].setHours(this.rangeDates[1].getHours()+1);
    this.vacationService.addVacationEvent({start: this.rangeDates[0], end: this.rangeDates[1]}, this.eventType);
    return true;
  }
}
