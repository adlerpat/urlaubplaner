import { Injectable, ViewContainerRef } from '@angular/core';
import { EventInput } from '@fullcalendar/angular';
import { NGXLogger } from 'ngx-logger';
import { ModalDialogService } from 'ngx-modal-dialog';
import { BehaviorSubject } from 'rxjs';
import { EventpickerComponent } from '../../core/eventpicker/eventpicker.component';
import { contextMenuType } from '../../planner/monthview/monthview.component';
import { DateSpan } from '../settings/settings.service';
import { eventpickerOptions } from '../../core/eventpicker/eventpicker.component';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  /** general vacation events */
  private _generalVacations$: BehaviorSubject<EventInput[]> = new BehaviorSubject<
    EventInput[]
  >([]);
  /** negate vacation events */
  private _negateVacations$: BehaviorSubject<EventInput[]> = new BehaviorSubject<
    EventInput[]
  >([]);

  /**
   * currently only provides injections
   * @param logger injected to log
   * @param modalService 
   */
  constructor(
    private logger: NGXLogger,
    private modalService: ModalDialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  /** expose vacation events */
  get generalVacations$(): BehaviorSubject<EventInput[]> {
    return this._generalVacations$;
  }
  /** expose negate vacation events */
  get negateVacations$(): BehaviorSubject<EventInput[]> {
    return this._negateVacations$;
  }

  /**
   * opens the eventpicker modal from view of calling component
   * @param eventpickerOptions contains the starting date and the event type e.g. bonus or vacation
   * @param viewContainerRef viewcontainerref from calling component
   */
  public openEventPickerModal(eventpickerOptions: eventpickerOptions, viewContainerRef: ViewContainerRef) {
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
    const title = type === "vacation" ? 'Vacation' : 'Negation';
    const newEvent: EventInput = {
      title: title,
      start: dateSpan.start,
      end: dateSpan.end,
      color: hexColor,
      classNames: [type],
      display: 'block',
    };

    if (type === "vacation") {
      const events = this._generalVacations$.value;
      events.push(newEvent);
      this._generalVacations$.next(events);
      const days = this.eventInputArrayToUrlString(this._generalVacations$.value);

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          vacationDays: days,
        },
        queryParamsHandling: 'merge',
      });

      this.logger.info("VacationService.addVacationEvent added general vacation event");

    } else {
      const events = this._negateVacations$.value;
      events.push(newEvent);
      this._negateVacations$.next(events);
      const days = this.eventInputArrayToUrlString(this._negateVacations$.value);

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          negationDays: days,
        },
        queryParamsHandling: 'merge',
      });

      this.logger.info("VacationService.addVacationEvent added bonus vacation event");
    }
  }

  public loadEventsFromUrl(urlString: string, type: string){
    const inputArray = this.urlStringToEventInputArray(urlString, type);
    if(type === "vacationDays"){
      this._generalVacations$.next(inputArray);
    }else{
      this._negateVacations$.next(inputArray);
    }
  }

  private eventInputArrayToUrlString(inputArray: EventInput[]): string {
    const datesForUrl: string[] = [];
    inputArray.forEach(x => {
      const start = (x.start as Date);
      start.setHours(start.getHours() + 3);
      const end = (x.end as Date);
      end.setHours(end.getHours() + 4);
      datesForUrl.push( start.toISOString().slice(0,10) );
      datesForUrl.push( end.toISOString().slice(0,10) );
    });
    return datesForUrl.join(",");
  }

  private urlStringToEventInputArray(urlString: string, type: string): EventInput[] {
    const datesForArray: Date[] = [];
    urlString.split(",").forEach(x => {
      datesForArray.push(new Date(x));
    });

    const inputs: EventInput[] = [];

    for(let i = 0; i < datesForArray.length; i = i+2){
      const hexColor = type === "vacationDays" ? '#B6FFCE' : '#217C7E';
      const title = type === "vacationDays" ? 'Vacation' : 'Negation';
      inputs.push({
          title: title,
          start: datesForArray[i],
          end: datesForArray[i+1],
          color: hexColor,
          classNames: [type],
          display: 'block',
        });
    }

    return inputs;
  }
}
