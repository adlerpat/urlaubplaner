import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

export type menuEvents = 'settingsHolidays' | 'settingsWorkdays' | 'settingsCompanyHolidays' | 'sendMail' | 'exportLink' | 'save';

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
  @Output() emitMenuEvent: EventEmitter<menuEvents> = new EventEmitter();
  
  /** Exposed through getter for template to build Menu Items */
  private _items: MenuItem[] = [];

  /**
   * 
   * @param primengConfig injected to allow configuration of ripple effect
   */
  constructor(private primengConfig: PrimeNGConfig) { }

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
            }
          },
          {
            label: 'Arbeitstage',
            command: (event) => {
              this.emitMenuEvent.emit('settingsWorkdays');
            }
          },
        ]
      },
      {
        label: 'Teilen',
        icon: 'pi pi-fw pi-send',
        items: [
          {
            label: 'Link',
            command: (event) => {
              this.emitMenuEvent.emit('exportLink');
            }
          },
          {
            label: 'E-Mail',
            command: (event) => {
              this.emitMenuEvent.emit('sendMail');
            }
          },
          // V2 { label: 'Team-Kalender' }
        ]
      },
      {
        label: 'Speichern',
        icon: 'pi pi-fw pi-save',
        command: (event) => {
          this.emitMenuEvent.emit('save');
        }
      }
    ];
  }
  
  get items(): MenuItem[] {
    return this._items;
  }
}
