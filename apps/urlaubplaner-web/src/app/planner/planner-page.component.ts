import { Component } from '@angular/core';

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

  /** initialize calendar instances */
  constructor() {
    this.updateCalendarDisplay();
  }

  get months() {
    return this._months;
  }

  get year() {
    return this._year;
  }
  set year(year: number) {
    this._year = year;
    this.updateCalendarDisplay();
  }

  /** sets the month of the calendar instances */
  private updateCalendarDisplay(): void {
    this._months = [];
    for(let i = 0; i < 12; i++){
      const month = new Date();
      month.setFullYear(this._year, i, 1);
      this.months.push(month);
    }
  }

}
