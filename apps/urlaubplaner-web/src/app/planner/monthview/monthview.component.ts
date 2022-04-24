import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

/**
 * MonthView Display Component
 * to be used in Planner Page for displaying calendar events
 */
@Component({
  selector: 'urlaubplaner-monthview',
  templateUrl: './monthview.component.html',
  styleUrls: ['./monthview.component.scss'],
})
export class MonthviewComponent implements OnInit{
  /** options for monthview calendar instance, initiated in oninit because spawnMonth input availability */
  public options: CalendarOptions = {};
  /** events that will be shown in the calendar */
  public events: any[] = [];

  /** used to initiate the monthview calendar at given month */
  @Input() spawnMonth!: Date;

  constructor() {
    //
  }

  /** initalize calendar options */
  ngOnInit() {
    this.options = {
      initialDate: this.spawnMonth,
      headerToolbar: {
        left: '',
        center: 'title',
        right: ''
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: this.events
    };
  }
}
