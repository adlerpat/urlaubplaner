import { Injectable, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventInput } from '@fullcalendar/angular';
import { NGXLogger } from 'ngx-logger';
import { ModalDialogService } from 'ngx-modal-dialog';
import { BehaviorSubject } from 'rxjs';
import { MenuEvents } from '../../core/menu/menu.component';
import { SettingsComponent } from '../../core/settings/settings.component';
import { ToastsService } from '../toasts/toasts.service';
import { VacationService } from '../vacation/vacation.service';
import { holidayOptionsHelper } from './settings-options.helper';

/** interface to help deal with holiday options in holiday settings */
export interface HolidayOption {
  /** shortHand identifier used for queryparam in route */
  shortHand: string;
  /** full name of state e.g. Hamburg */
  state: string;
}

/** interface to help deal with Datespan e.g. for CompanyHolidays */
export interface DateSpan {
  /** starting date */
  start: Date;
  /** ending date */
  end: Date;
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

  /** company holiday data */
  private _companyHolidays$: BehaviorSubject<EventInput[]> = new BehaviorSubject<
    EventInput[]
  >([]);

  /** max vacation days setting */
  private _maxVacationDays$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * currently only provides injections
   * @param modalService injected to be able to spawn modal dialogs
   * @param router injected to modify route queryparams on settings change
   * @param activatedRoute injected to get current route for router setting queryparams
   * @param logger injected to log important events
   */
  constructor(
    private modalService: ModalDialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: NGXLogger,
    private toastService: ToastsService,
    private vacationServie: VacationService
  ) { }

  /** expose possible states filters for holidays */
  get possibleHolidayOptions(): HolidayOption[] {
    return this._possibleHolidayOptions;
  }
  /** expose company holidays */
  get companyHolidays$(): BehaviorSubject<EventInput[]> {
    return this._companyHolidays$;
  }
  /** expose max vacation days */
  get maxVacationDays$(): BehaviorSubject<number> {
    return this._maxVacationDays$;
  }
  /**
   * sets next value of max vacationdays subject
   * @param days number of days that is maximum
   */
  public setMaxVacationDays$(days: number) {
    if (days == undefined) {
      this.logger.debug('HolidaysService.setMaxVacationDays called without number of days.');
      return;
    }
    this.logger.debug('SettingsService.setMaxVacationDays called for ' + days);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        maxDays: days,
      },
      queryParamsHandling: 'merge',
    });
    this._maxVacationDays$.next(days);
  }

  /** open settings modal with depending setting site target
   * @param $event which settings are targeted
   * @param viewContainerRef where to spawn the modal
   */
  public openSettings($event: MenuEvents, viewContainerRef: ViewContainerRef) {
    if ($event === "save") {
      this.toastService.infoToast("Press Ctrl + D to Bookmark your current Calendar.")
      return;
    }

    if ($event === "exportLink") {
      navigator.clipboard.writeText(window.location.href);
      this.toastService.infoToast("Copied to Clipboard.")
      return;
    }

    if ($event === "sendMail") {
      let text = "\n\nVacation Dates:\n";
      let events: EventInput[] = [];
      this._companyHolidays$.value.forEach(x => {
        if((x.start as Date).getFullYear() === 1111){
          return;
        }
        events.push(x);
      });
      this.vacationServie.generalVacations$.value.forEach(x => {
        events.push(x);
      });
      events = events.filter(x => {
        const startDate = x.start as Date;
        const endDate = x.end as Date;
        const find = this.vacationServie.negateVacations$.value.find(y => (y.start as Date).toISOString().slice(0,10) === startDate.toISOString().slice(0,10) && (y.end as Date).toISOString().slice(0,10) === endDate.toISOString().slice(0,10));
        if(!find){
          return true;
        }else{
          return false;
        }
      }
      );

      events.sort((a,b) =>  (a.start as Date).getTime() - (b.start as Date).getTime());

      events.forEach(x => {
        const startDate = x.start as Date;
        const endDate = x.end as Date;
        text += "\n" + startDate.toISOString().slice(0,10) + " - " + endDate.toISOString().slice(0,10);
      });

      const link = "mailto:"
        + "?cc="
        + "&subject=" + encodeURIComponent("Vacation Plan")
        + "&body=" + encodeURIComponent(window.location.href+text);

      window.location.href = link;
      return;
    }

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
    if (states == undefined) {
      this.logger.debug('HolidaysService.setHolidayConfig called without states.');
      return;
    }
    this.logger.debug('SettingsService.setHolidayConfig called for ' + states);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        states: states.toString().toLowerCase(),
      },
      queryParamsHandling: 'merge',
    });
  }
  /**
   * sets the company holidays based on given dates
   * @param dates list of dates where company has holiday
   */
  public setCompanyHolidayConfig(dates: Date[], preset: string) {
    if (!dates) {
      this.logger.debug('HolidaysService.getHolidays called without dates.');
      return;
    }
    const clusteredDates: DateSpan[] = this.clusterDays(dates);
    const temps: EventInput[] = [];
    clusteredDates.forEach((dateSpan) => {
      temps.push({
        title: "Company Holiday",
        start: dateSpan.start,
        end: dateSpan.end,
        color: '#9FB4FF',
        classNames: ['companyHoliday'],
        editable: false,
        display: 'block'
      });
    });
    this._companyHolidays$.next(temps);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        preset: preset,
      },
      queryParamsHandling: 'merge',
    });
  }
  /**
   * clusters dates into consecutive events (1.1,2.1,3.1,6.1,8.1 -> 1.1 - 3.1 , 6.1 , 8.1)
   * @param dates list of dates
   * @returns list of DateSpan for calendar event creation
   */
  private clusterDays(dates: Date[]): DateSpan[] {
    this.logger.debug('HolidaysService.clusterDays called');
    const dateSpans: DateSpan[] = [];

    let currentDateSpan: DateSpan = { start: new Date("1111-11-11"), end: new Date("1111-11-11") };
    let lastDate: Date = new Date("1111-11-11");

    dates.forEach((date) => {
      if (currentDateSpan.start == new Date("1111-11-11")) {
        currentDateSpan = { start: date, end: date };
      }

      if (lastDate && !this.isConsecutive(lastDate, date)) {
        currentDateSpan.end = lastDate;
        dateSpans.push(currentDateSpan);
        currentDateSpan = { start: date, end: date };
      }
      lastDate = date;
    });

    currentDateSpan.end = lastDate;
    dateSpans.push(currentDateSpan);

    return dateSpans;
  }
  /** function to check if 2 dates are eithers date next day
   * @param date1 first date
   * @param date2 second date
   * @returns true if consecutive false if not
   */
  private isConsecutive(date1: Date, date2: Date): boolean {
    const date1m1: Date = new Date();
    date1m1.setDate(date1.getDate() - 1);
    const date1p1: Date = new Date();
    date1p1.setDate(date1.getDate() + 1);
    if (date1m1.getDate() === date2.getDate() || date1p1.getDate() === date2.getDate() || date1.getDate() === date2.getDate()) {
      return true;
    } else {
      return false;
    }
  }
}
