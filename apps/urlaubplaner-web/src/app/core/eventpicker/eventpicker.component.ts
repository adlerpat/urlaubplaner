import { Component, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogButton, IModalDialogOptions } from 'ngx-modal-dialog';
import { contextMenuType } from '../../planner/monthview/monthview.component';
import { VacationService } from '../../services/vacation/vacation.service';

export interface eventpickerOptions {
  startingDate: Date,
  eventType: contextMenuType
}

@Component({
  selector: 'urlaubplaner-eventpicker',
  templateUrl: './eventpicker.component.html',
  styleUrls: ['./eventpicker.component.scss'],
})
export class EventpickerComponent implements IModalDialog {
  /** actionbuttons used by Interface IModalDialog, configured in constructor */
  private actionButtons: IModalDialogButton[];
  private eventType: contextMenuType = "vacation";

  public rangeDates: Date[] = [];


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
    this.rangeDates[0] = (options.data as eventpickerOptions).startingDate;
    this.eventType = (options.data as eventpickerOptions).eventType;
  }
  /** handles close event by passing data to vacationService method with depending vacation type */
  createAndClose(): boolean {
    this.rangeDates[1].setHours(this.rangeDates[1].getHours()+1);
    this.vacationService.addVacationEvent({start: this.rangeDates[0], end: this.rangeDates[1]}, this.eventType);
    return true;
  }
}
