import { Component, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateInput, EventInput } from '@fullcalendar/angular';
import { BehaviorSubject } from 'rxjs';
import { presetMap } from '../core/settings/company-holidays-settings/company-holidays-presets.helper';
import { HolidaysService } from '../services/holidays/holidays.service';
import { SettingsService } from '../services/settings/settings.service';
import { VacationService } from '../services/vacation/vacation.service';
import { contextMenuType } from './monthview/monthview.component';

/**
 * Page Component for Planner Functionality,
 * embeds components like monthview and handles all data manipulation
 */
@Component({
  templateUrl: './planner-page.component.html',
  styleUrls: ['./planner-page.component.scss'],
})
export class PlannerPageComponent {
  /** tracker of year to view in calendar view, initializes to current year */
  private _year = new Date().getFullYear();
  /** for calendar list generation */
  private _months: Date[] = [];
  /** marker for how the year view has been modified, use instead of comparing dates */
  private _yearModifier = 0;

  /**
   * initialize calendar instances
   * @param holidaysService injected to get state holidays
   * @param settingsService injected to expose general settings e.g. company holidays
   * @param activatedRoute injected to get router queryparams
   */
  constructor(private holidaysService: HolidaysService, private settingsService: SettingsService, private activatedRoute: ActivatedRoute, private vacationService: VacationService, private viewContainerRef: ViewContainerRef) {
    this.updateCalendarDisplay();
    this.holidaysService.getHolidays();
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        if(params['preset']) {
          const preset = presetMap.get(params['preset']);
          if(preset != undefined){
            settingsService.setCompanyHolidayConfig(preset.holidayDays.sort((a, b) => a.getTime() - b.getTime()), preset.shortHand)
          }
        }
        if(params['maxDays']){
          const maxDays = params['maxDays'];
          settingsService.setMaxVacationDays$(maxDays);
        }
        if(params['vacationDays']){
          const urlString = params['vacationDays'];
          vacationService.loadEventsFromUrl(urlString, "vacationDays");
        }
        if(params['negationDays']){
          const urlString = params['negationDays'];
          vacationService.loadEventsFromUrl(urlString, "negationDays");
        }
      },
    });
  }
  /** expose months to display to template to pass to view child components */
  get months(): Date[] {
    return this._months;
  }
  /** expose year to template headline */
  get year(): number {
    return this._year;
  }
  /** expose yearmodifier to template buttons */
  get yearModifier(): number {
    return this._yearModifier;
  }
  /** get holidayservice eventinput array depending on yearmodifier */
  get events$(): BehaviorSubject<EventInput[]> {
    switch (this._yearModifier) {
      case 0:
        return this.holidaysService.holidaysY0$;
      case 1:
        return this.holidaysService.holidaysY1$;
      case 2:
        return this.holidaysService.holidaysY2$;

      default:
        return this.holidaysService.holidaysY0$;
    }
  }
  /** getter to expose settings service company holidays eventinput array */
  get companyHolidays$(): BehaviorSubject<EventInput[]> {
    return this.settingsService.companyHolidays$;
  }
  /** getter to expose vacation service general vacation eventinput array */
  get generalVacations$(): BehaviorSubject<EventInput[]> {
    return this.vacationService.generalVacations$;
  }
  /** getter to expose vacation service bonus vacation eventinput array */
  get negateVacations$(): BehaviorSubject<EventInput[]> {
    return this.vacationService.negateVacations$;
  }
  /** getter to retrieve total planned vacation days */
  get vacationDays(): number {
    let days = -1;
    this.companyHolidays$.value.forEach(x => {
      if(x.start && x.end){
        const diffDays = this.getDifferenceInDays(x.start as Date,x.end as Date)+1;
        days += diffDays;
      }
    });
    this.generalVacations$.value.forEach(x => {
      if(x.start && x.end){
        const diffDays = this.getDifferenceInDays(x.start as Date,x.end as Date);
        days += diffDays + 1;
      }
    });
    this.negateVacations$.value.forEach(x => {
      if(x.start && x.end){
        const diffDays = this.getDifferenceInDays(x.start as Date,x.end as Date);
        days -= diffDays+1;
      }
    });
    return days;
  }
  /** getter to retrieve max spendable vacation days from settings */
  get vacationDaysTotal(): number {
    return this.settingsService.maxVacationDays$.value;
  }

  /** sets the month of the calendar instances */
  private updateCalendarDisplay(): void {
    this._months = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date();
      month.setFullYear(this._year, i, 1);
      this.months.push(month);
    }
  }

  /** to switch year on calendar view, between current year and current year +2  */
  public modifyYear(modifier: number) {
    if (
      this._yearModifier + modifier != -1 &&
      this._yearModifier + modifier != 3
    ) {
      this._yearModifier += modifier;
      this._year += modifier;
    }

    this.updateCalendarDisplay();
  }

  /** create popup to create new event based on contextmenutype */
  public handleCreateNewEvent($event: contextMenuType){
    this.vacationService.openEventPickerModal({eventType: $event, startingDate: new Date()}, this.viewContainerRef)
  }

  private getDifferenceInDays(date1: Date, date2: Date) {
    const timeInMilisec: number = date2.getTime() - date1.getTime();
    const daysBetweenDates: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
    return daysBetweenDates;
  }
}
