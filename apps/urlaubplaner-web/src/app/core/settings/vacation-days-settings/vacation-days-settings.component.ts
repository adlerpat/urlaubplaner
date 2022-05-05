import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'urlaubplaner-vacation-days-settings',
  templateUrl: './vacation-days-settings.component.html',
  styleUrls: ['./vacation-days-settings.component.scss'],
})
export class VacationDaysSettingsComponent {
  /** input of already selected number of days */
  @Input() days = 30;
  /** pass settings to settings component parent */
  @Output() settingsFeedback: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    //
  }
}
