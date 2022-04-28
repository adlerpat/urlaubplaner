import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/angular';
import { NgTippyService } from 'angular-tippy';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

/**
 * MonthView Display Component
 * to be used in Planner Page for displaying calendar events
 */
@Component({
  selector: 'urlaubplaner-monthview',
  templateUrl: './monthview.component.html',
  styleUrls: ['./monthview.component.scss'],
})
export class MonthviewComponent implements OnInit {
  /** stores state holidays eventinput array */
  private _holidaysForMerge: EventInput[] = [];
  /** stores company holidays eventinput array */
  private _companyHolidaysForMerge: EventInput[] = [];

  /** options for monthview calendar instance, initiated in oninit because spawnMonth input availability */
  public options: CalendarOptions = {};

  /** used to initiate the monthview calendar at given month */
  @Input() spawnMonth!: Date;

  /** events that will be shown in the calendar */
  @Input() events!: BehaviorSubject<EventInput[]>;
  /** events that will be shown in the calendar */
  @Input() companyHolidays!: BehaviorSubject<EventInput[]>;

  /**
   * currently only provides injections
   * @param logger injected to log important incidents
   * @param tippy injected to allow for hover over events and show tooltip
   */
  constructor(private logger: NGXLogger, private tippy: NgTippyService) {
  }

  /** initalize calendar options */
  ngOnInit() {
    /** set basic options for calendar */
    this.options = {
      initialDate: this.spawnMonth,
      headerToolbar: {
        left: '',
        center: 'title',
        right: '',
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      displayEventTime: false,
      events: [],
      eventMouseEnter: (mouseEnterInfo) => {
        const element: ElementRef = new ElementRef(mouseEnterInfo.el);
        if (mouseEnterInfo.event.classNames.includes('holiday')) {
          const tippyInstance = this.tippy.init(element, {
            content: mouseEnterInfo.event.title,
            theme: 'holiday',
            animateFill: false,
            arrow: true,
            arrowType: 'round',
          });
          tippyInstance?.show(500);
        }

        if (mouseEnterInfo.event.classNames.includes('companyHoliday')) {
          const tippyInstance = this.tippy.init(element, {
            content: mouseEnterInfo.event.title,
            theme: 'companyHoliday',
            animateFill: false,
            arrow: true,
            arrowType: 'round',
          });
          tippyInstance?.show(500);
        }
      },
    };
    /** subscribe to events and modify events if updated */
    this.events.subscribe({
      next: (values) => {
        this._holidaysForMerge = values;
        this.options.events = this._companyHolidaysForMerge.concat(this._holidaysForMerge);
      },
      error: (error) => {
        this.logger.error('MonthviewComponent: ' + error);
      },
    });
    /** subscribe to events and modify events if updated */
    this.companyHolidays.subscribe({
      next: (values) => {
        this._companyHolidaysForMerge = values;
        this.options.events = this._companyHolidaysForMerge.concat(this._holidaysForMerge);
      },
      error: (error) => {
        this.logger.error('MonthviewComponent: ' + error);
      }
    })
  }
}
