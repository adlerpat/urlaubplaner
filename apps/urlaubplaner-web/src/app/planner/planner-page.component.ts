import { Component } from '@angular/core';
import { EventInput } from '@fullcalendar/angular';
import { BehaviorSubject } from 'rxjs';
import { HolidaysService } from '../services/holidays/holidays.service';

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

  /** initialize calendar instances */
  constructor(private holidaysService: HolidaysService) {
    this.updateCalendarDisplay();
    this.holidaysService.getHolidays();
  }

  get months(): Date[] {
    return this._months;
  }
  get year(): number {
    return this._year;
  }
  get yearModifier(): number {
    return this._yearModifier;
  }

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
