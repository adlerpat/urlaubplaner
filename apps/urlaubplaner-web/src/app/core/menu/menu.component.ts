import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

/** menuEvent type definition to communicate to app component */
export type MenuEvents =
  | 'settingsHolidays'
  | 'settingsWorkdays'
  | 'settingsCompanyHolidays'
  | 'settingsMaximumDays'
  | 'sendMail'
  | 'exportLink'
  | 'save';

/**
 * Menu Display Component
 * communicates to app component master via emitMenuEvent Output
 */
@Component({
  selector: 'urlaubplaner-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  /** EventEmitter to Communicate with Parent Component (AppComponent) */
  @Output() emitMenuEvent: EventEmitter<MenuEvents> = new EventEmitter();

  /** Exposed through getter for template to build Menu Items */
  private _items: MenuItem[] = [];

  /**
   * currently only provides injections
   * @param primengConfig injected to allow configuration of ripple effect
   */
  constructor(private primengConfig: PrimeNGConfig) {}

  /** Set Menu Items (with eventEmits) and Configure PrimeNG Ripple */
  ngOnInit() {
    this.primengConfig.ripple = true;

    this._items = [
      {
        label: 'Einstellungen',
        icon: 'pi pi-fw pi-sliders-h',
        items: [
          {
            label: 'Feiertage',
            command: (event) => {
              this.emitMenuEvent.emit('settingsHolidays');
            },
          },
          {
            label: 'Betriebsferien',
            command: (event) => {
              this.emitMenuEvent.emit('settingsCompanyHolidays');
            },
          },
          //{
          //  label: 'Arbeitstage',
          //  command: (event) => {
          //    this.emitMenuEvent.emit('settingsWorkdays');
          //  },
          //},
          {
            label: 'Verfügbarer Urlaub',
            command: (event) => {
              this.emitMenuEvent.emit('settingsMaximumDays');
            },
          },
        ],
      },
      {
        label: 'Teilen',
        icon: 'pi pi-fw pi-send',
        items: [
          {
            label: 'Link',
            command: (event) => {
              this.emitMenuEvent.emit('exportLink');
            },
          },
          {
            label: 'E-Mail',
            command: (event) => {
              this.emitMenuEvent.emit('sendMail');
            },
          },
          // V2 { label: 'Team-Kalender' }
        ],
      },
      {
        label: 'Speichern',
        icon: 'pi pi-fw pi-save',
        command: (event) => {
          this.emitMenuEvent.emit('save');
        },
      },
    ];
  }

  /** exposes menu items to template */
  get items(): MenuItem[] {
    return this._items;
  }
}
