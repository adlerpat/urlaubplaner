import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HolidayOption } from '../../../services/settings/settings.service';

/**
 * component for handling holiday settings via checkboxes
 */
@Component({
  selector: 'urlaubplaner-holiday-settings',
  templateUrl: './holiday-settings.component.html',
  styleUrls: ['./holiday-settings.component.scss'],
})
export class HolidaySettingsComponent implements OnInit {
  /** model for checkboxes */
  public selectedValues: string[] = [];

  /** options to generate checkboxes */
  @Input() holidayOptions!: HolidayOption[];
  /** input of already selected options */
  @Input() selectedHolidayOptions!: BehaviorSubject<string[]>;
  /** pass settings to settings component parent */
  @Output() settingsFeedback: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  /** use selected or fill with all if no selected */
  ngOnInit() {
    if (this.selectedHolidayOptions.value.length > 0) {
      this.selectedValues = this.selectedHolidayOptions.value;
    } else {
      this.holidayOptions.forEach((value) =>
        this.selectedValues.push(value.shortHand)
      );
    }
  }

  /** puts none in selectedValues and emits none -> api responds with all */
  resetSelected() {
    this.selectedValues = [];
    this.settingsFeedback.emit(this.selectedValues);
  }

  /** puts all in selectedValues but emits none -> api responds with all */
  selectAll() {
    this.selectedValues = [];
    this.holidayOptions.forEach((value) =>
      this.selectedValues.push(value.shortHand)
    );
    this.settingsFeedback.emit([]);
  }
}
