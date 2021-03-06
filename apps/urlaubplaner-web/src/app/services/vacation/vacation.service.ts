import { Injectable, ViewContainerRef } from '@angular/core';
import { DateInput, EventInput } from '@fullcalendar/angular';
import { NGXLogger } from 'ngx-logger';
import { ModalDialogService } from 'ngx-modal-dialog';
import { BehaviorSubject } from 'rxjs';
import { EventpickerComponent } from '../../core/eventpicker/eventpicker.component';
import { contextMenuType } from '../../planner/monthview/monthview.component';
import { DateSpan, SettingsService } from '../settings/settings.service';
import { eventpickerOptions } from '../../core/eventpicker/eventpicker.component';
import { ActivatedRoute, Router } from '@angular/router';
/** service for dealing with vacation days and negation days */
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
   * @param modalService injected to create modals from service
   * @param router injected to reroute after adding query params
   * @param activatedRoute injected to retrieve current route query params
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
   * @param eventpickerOptions contains the starting date and the event type e.g. negation or vacation
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
   * @param type which type of vacation event e.g. vacation or negation
   */
  public addVacationEvent(dateSpan: DateSpan, type: contextMenuType) {
    this.logger.info("VacationService.addVacationEvent called with datespan and contextmenu:");
    const hexColor = type === "vacation" ? '#B6FFCE' : '#217C7E';
    const title = type === "vacation" ? 'Vacation' : 'Negate Vacation';
    const newEvent: EventInput = {
      title: title,
      start: dateSpan.start,
      end: dateSpan.end,
      color: hexColor,
      classNames: [type],
      display: 'block',
    };

    if (type === "vacation") {
      const negateFiltered = this._negateVacations$.value.filter(x => !this.isEventInputEqualCorrected(x, newEvent));
      this._negateVacations$.next(negateFiltered);

      const events = this._generalVacations$.value;
      events.push(newEvent);
      this._generalVacations$.next(events);
      const days = this.eventInputArrayToUrlString(this._generalVacations$.value);
      const negations = this.eventInputArrayToUrlString(this._negateVacations$.value);

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          vacationDays: days,
          negationDays: negations
        },
        queryParamsHandling: 'merge',
      });

      this.logger.info("VacationService.addVacationEvent added general vacation event");

    } else { //TODO: Dont save negations when its a normal vacation days just remove vacation days, dont save when theres no other event
      const vacationFind = this._generalVacations$.value.find(x => this.isEventInputEqual(x, newEvent));

      if (vacationFind) {
        const vacationFilter = this._generalVacations$.value.filter(x => this.isEventInputEqual(x, newEvent));
        this._generalVacations$.next(vacationFilter);

        this.logger.info("VacationService.addVacationEvent added vacation negation event by removing vacation");
      }
      else{
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

        this.logger.info("VacationService.addVacationEvent added vacation negation event without removing events");
      }
    }
  }
  /**
   * load url date events into subjects
   * @param urlString the stringified dates from the url with comma seperation
   * @param type which type of event is to be created
   */
  public loadEventsFromUrl(urlString: string, type: string) {
    const inputArray = this.urlStringToEventInputArray(urlString, type);
    if (type === "vacationDays") {
      this._generalVacations$.next(inputArray);
    } else {
      this._negateVacations$.next(inputArray);
    }
  }
  /**
   * turns an eventinput array in to query param string for url
   * @param inputArray event input to be converted
   * @returns string to be put in url queryparams
   */
  private eventInputArrayToUrlString(inputArray: EventInput[]): string {
    let datesForUrl: string[] = [];
    inputArray.forEach(x => {
      const start = (x.start as Date);
      start.setHours(start.getHours() + 3);
      const end = (x.end as Date);
      end.setHours(end.getHours() + 4);
      datesForUrl.push(start.toISOString().slice(0, 10));
      datesForUrl.push(end.toISOString().slice(0, 10));
    });

    datesForUrl = [... new Set(datesForUrl)];
    return datesForUrl.join(",");
  }
  /**
   * turns an query param string from url in to eventinput array
   * @param urlString string to be converted
   * @param type type of event to be created
   * @returns eventinput array to be put into subjects
   */
  private urlStringToEventInputArray(urlString: string, type: string): EventInput[] {
    const datesForArray: Date[] = [];
    urlString.split(",").forEach(x => {
      datesForArray.push(new Date(x));
    });

    const inputs: EventInput[] = [];

    for (let i = 0; i < datesForArray.length; i = i + 2) {
      const hexColor = type === "vacationDays" ? '#B6FFCE' : '#217C7E';
      const title = type === "vacationDays" ? 'Vacation' : 'Negate Vacation';
      inputs.push({
        title: title,
        start: datesForArray[i],
        end: datesForArray[i + 1],
        color: hexColor,
        classNames: [type],
        display: 'block',
      });
    }

    return inputs;
  }

  private isEventInputEqual(date1: EventInput, date2: EventInput) {
    return this.dateInputIso10(date1.start) === this.dateInputIso10(date2.start) && this.dateInputIso10(date1.end) === this.dateInputIso10(date2.end);
  }

  private isEventInputEqualCorrected(date1: EventInput, date2: EventInput){
    const date2StartAsDate = date2.start as Date;
    const date2EndAsDate = date2.end as Date;
    const date2TempStart = new Date();
    const date2TempEnd = new Date();

    date2TempStart.setDate(date2StartAsDate.getDate());
    date2TempEnd.setDate(date2EndAsDate.getDate());

    return this.dateInputIso10(date1.start) === this.dateInputIso10(date2TempStart) && this.dateInputIso10(date1.end) === this.dateInputIso10(date2TempEnd);
  }

  private dateInputIso10(dateInput: DateInput | undefined): string {
    if (dateInput === undefined) return "";
    const date = (dateInput as Date);
    return date.toISOString().slice(0, 10);
  }
}
