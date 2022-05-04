import { Injectable, ViewContainerRef } from '@angular/core';
import { EventInput } from '@fullcalendar/angular';
import { NGXLogger } from 'ngx-logger';
import { ModalDialogService } from 'ngx-modal-dialog';
import { BehaviorSubject } from 'rxjs';
import { EventpickerComponent } from '../../core/eventpicker/eventpicker.component';
import { contextMenuType } from '../../planner/monthview/monthview.component';
import { DateSpan } from '../settings/settings.service';
import { eventpickerOptions } from '../../core/eventpicker/eventpicker.component';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  /** general vacation events */
  private _generalVacations$: BehaviorSubject<EventInput[]> = new BehaviorSubject<
    EventInput[]
  >([]);
  /** bonus days vacation events */
  private _bonusVacations$: BehaviorSubject<EventInput[]> = new BehaviorSubject<
    EventInput[]
  >([]);

  /**
   * currently only provides injections
   * @param logger injected to log
   * @param modalService 
   */
  constructor(private logger: NGXLogger, private modalService: ModalDialogService) { }

  /** expose vacation events */
  get generalVacations$(): BehaviorSubject<EventInput[]> {
    return this._generalVacations$;
  }
  /** expose bonus vacation events */
  get bonusVacations$(): BehaviorSubject<EventInput[]> {
    return this._bonusVacations$;
  }

  /**
   * opens the eventpicker modal from view of calling component
   * @param eventpickerOptions contains the starting date and the event type e.g. bonus or vacation
   * @param viewContainerRef viewcontainerref from calling component
   */
  public openEventPickerModal(eventpickerOptions: eventpickerOptions, viewContainerRef: ViewContainerRef){
    this.logger.info("VacationService.openEventPickerModal called");
    this.modalService.openDialog(viewContainerRef, {
      title: 'Pick Vacation Dates',
      childComponent: EventpickerComponent,
      data: eventpickerOptions,
    });
  }
  /**
   * adds the vacation event depending on the type to the list of events
   * @param dateSpan from which to which date the event is created
   * @param type which type of vacation event e.g. vacation or bonus
   */
  public addVacationEvent(dateSpan: DateSpan, type: contextMenuType) {
    this.logger.info("VacationService.addVacationEvent called with datespan and contextmenu:");
    const hexColor = type === "vacation" ? '#B6FFCE' : '#217C7E';
    const title = type === "vacation" ? 'Vacation' : 'Bonus Days';
    const newEvent: EventInput = {
      title: title,
      start: dateSpan.start,
      end: dateSpan.end,
      color: hexColor,
      classNames: [type],
      display: 'block',
    };

    if(type === "vacation"){
      const events = this._generalVacations$.value;
      events.push(newEvent);
      this._generalVacations$.next(events);
      this.logger.info("VacationService.addVacationEvent added general vacation event");
    }else{
      const events = this._bonusVacations$.value;
      events.push(newEvent);
      this._bonusVacations$.next(events);
      this.logger.info("VacationService.addVacationEvent added bonus vacation event");
    }
  }
}
