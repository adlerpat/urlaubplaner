import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventInput } from '@fullcalendar/angular';
import { BehaviorSubject } from 'rxjs';
import { presetMap } from '../core/settings/company-holidays-settings/company-holidays-presets.helper';
import { HolidaysService } from '../services/holidays/holidays.service';
import { SettingsService } from '../services/settings/settings.service';

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
  constructor(private holidaysService: HolidaysService, private settingsService: SettingsService, private activatedRoute: ActivatedRoute) {
    this.updateCalendarDisplay();
    this.holidaysService.getHolidays();
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        if(params['preset']) {
          const preset = presetMap.get(params['preset']);
          if(preset != undefined){
            settingsService.setCompanyHolidayConfig(preset.holidayDays, preset.shortHand)
          }
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
}
