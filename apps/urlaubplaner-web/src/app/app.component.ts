import { Component, ViewContainerRef } from '@angular/core';
import { MenuEvents } from './core/menu/menu.component';
import { SettingsService } from './services/settings/settings.service';

/**
 * Master Component for all pages,
 * embeds always on components like navbar and router outlet
 */
@Component({
  selector: 'urlaubplaner-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * currently only provides injections
   * @param settingsService injected to open settings modal on menu event settings case
   * @param viewContainerRef injected to pass viewref to settingsservice
   */
  constructor(
    private settingsService: SettingsService,
    private viewContainerRef: ViewContainerRef
  ) {
    //
  }

  /**
   * Method that handles the emitted Events from the Menu Component
   * @param $event event of type menuEvents fired by menu component (e.g. exportLink, save, settingsHolidays,...)
   */
  public handleMenuEvent($event: MenuEvents) {
    this.settingsService.openSettings($event, this.viewContainerRef);
  }
}
