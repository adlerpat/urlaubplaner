import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarOptions, DateInput, EventInput } from '@fullcalendar/angular';
import { NgTippyService } from 'angular-tippy';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api';

export type contextMenuType = "vacation" | "negate";

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
  /** stores general vacation eventinput array */
  private _generalVacationsForMerge: EventInput[] = [];
  /** stores negation vacation eventinput array */
  private _negationVacationsForMerge: EventInput[] = [];
  /** stores calendar selection information */
  private _selectedDates: any = {};

  /** options for monthview calendar instance, initiated in oninit because spawnMonth input availability */
  public options: CalendarOptions = {};
  /** items for context menu configuration on rightlick calendar */
  public contextMenuItems: MenuItem[] = [];

  /** used to initiate the monthview calendar at given month */
  @Input() spawnMonth!: Date;
  /** events that will be shown in the calendar */
  @Input() events!: BehaviorSubject<EventInput[]>;
  /** events that will be shown in the calendar */
  @Input() companyHolidays!: BehaviorSubject<EventInput[]>;
  /** events that will be shown in the calendar */
  @Input() generalVacations$!: BehaviorSubject<EventInput[]>;
  /** events that will be shown in the calendar */
  @Input() negationVacations$!: BehaviorSubject<EventInput[]>;
  /** event output to make parent component trigger create new event flow with according contextmenutype */
  @Output() createNewEvent: EventEmitter<contextMenuType> = new EventEmitter<contextMenuType>();
  /** event output to make parent component trigger create new event flow with according contextmenutype */
  @Output() selectionInfoChange: EventEmitter<Date[]> = new EventEmitter<Date[]>();
  

  /**
   * currently only provides injections
   * @param logger injected to log important incidents
   * @param tippy injected to allow for hover over events and show tooltip
   */
  constructor(private logger: NGXLogger, private tippy: NgTippyService) {
    //
  }

  get selectedDates() {
    return this._selectedDates;
  }

  /** initalize calendar options */
  ngOnInit() {

    this.contextMenuItems = [
      {
        label: 'Add Vacation',
        icon: 'pi pi-fw pi-plus',
        command: () => this.createNewEvent.emit("vacation")
      },
      {
        separator: true
      },
      {
        label: 'Remove Vacation',
        icon: 'pi pi-fw pi-minus',
        command: () => this.createNewEvent.emit("negate")
      },
    ];

    /** set basic options for calendar */
    this.options = {
      timeZone: 'local',
      initialDate: this.spawnMonth,
      headerToolbar: {
        left: '',
        center: 'title',
        right: '',
      },
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      displayEventTime: false,
      select: (selectionInfo) => {
        selectionInfo.end.setDate(selectionInfo.end.getDate() - 1);
        this._selectedDates = selectionInfo;
        this.selectionInfoChange.emit([selectionInfo.start, selectionInfo.end]);
      },
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

        if (mouseEnterInfo.event.classNames.includes('vacation')) {
          const tippyInstance = this.tippy.init(element, {
            content: mouseEnterInfo.event.title,
            theme: 'vacation',
            animateFill: false,
            arrow: true,
            arrowType: 'round',
            interactive: false,
          });
          tippyInstance?.show(500);
        }

        if (mouseEnterInfo.event.classNames.includes('negation')) {
          const tippyInstance = this.tippy.init(element, {
            content: mouseEnterInfo.event.title,
            theme: 'negation',
            animateFill: false,
            arrow: true,
            arrowType: 'round',
            interactive: false,
          });
          tippyInstance?.show(500);
        }
      },
    };
    /** subscribe to events and modify events if updated */
    this.events.subscribe({
      next: (values) => {
        this._holidaysForMerge = values;
        this.options.events = this.filteredEvents();
      },
      error: (error) => {
        this.logger.error('MonthviewComponent: ' + error);
      },
    });
    /** subscribe to events and modify events if updated */
    this.companyHolidays.subscribe({
      next: (values) => {
        this._companyHolidaysForMerge = values;
        this.options.events = this.filteredEvents();
      },
      error: (error) => {
        this.logger.error('MonthviewComponent: ' + error);
      }
    });
    /** subscribe to events and modify events if updated */
    this.generalVacations$.subscribe({
      next: (values) => {
        this._generalVacationsForMerge = values;
        this.options.events = this.filteredEvents();
      },
      error: (error) => {
        this.logger.error('MonthviewComponent: ' + error);
      }
    });
    /** subscribe to events and modify events if updated */
    this.negationVacations$.subscribe({
      next: (values) => {
        this._negationVacationsForMerge = values;
        this.options.events = this.filteredEvents();
      },
      error: (error) => {
        this.logger.error('MonthviewComponent: ' + error);
      }
    });
  }

  private filteredEvents(): EventInput[] {
    let generalVacation = this._generalVacationsForMerge.filter(x => this._negationVacationsForMerge.find(y => this.dateInputIso10(y.start) === this.dateInputIso10(x.start) && this.dateInputIso10(y.end) === this.dateInputIso10(x.end)) === undefined);
    const companyHolidays = this._companyHolidaysForMerge.filter(x => this._negationVacationsForMerge.find(y => this.dateInputIso10(y.start) === this.dateInputIso10(x.start) && this.dateInputIso10(y.end) === this.dateInputIso10(x.end)) === undefined);
    generalVacation = generalVacation.filter(x => companyHolidays.find(y => this.dateInputIso10(y.start) === this.dateInputIso10(x.start) && this.dateInputIso10(y.end) === this.dateInputIso10(x.end)) === undefined);

    return this._holidaysForMerge.concat(generalVacation,companyHolidays);
  }

  private dateInputIso10(dateInput: DateInput | undefined): string {
    if(dateInput === undefined) return "";
    const date = (dateInput as Date);
    return date.toISOString().slice(0,10);
  }
}
