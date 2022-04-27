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
  /** options for monthview calendar instance, initiated in oninit because spawnMonth input availability */
  public options: CalendarOptions = {};

  /** used to initiate the monthview calendar at given month */
  @Input() spawnMonth!: Date;

  /** events that will be shown in the calendar */
  @Input() events!: BehaviorSubject<EventInput[]>;

  /**
   * currently only provides injections
   * @param logger injected to log important incidents
   * @param tippy injected to allow for hover over events and show tooltip
   */
  constructor(private logger: NGXLogger, private tippy: NgTippyService) {
    //
  }

  /** initalize calendar options */
  ngOnInit() {
    /** subscribe to events and modify options of calendar (includes events) if updated */
    this.events.subscribe({
      next: (values) => {
        this.logger.debug(
          'MonthviewComponent: ' + this.spawnMonth.toDateString()
        );
        this.logger.debug(this.events);
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
          events: values,
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
              tippyInstance.show(500);
            }
          },
        };
      },
      error: (error) => {
        this.logger.error('MonthviewComponent: ' + error);
      },
    });
  }
}
