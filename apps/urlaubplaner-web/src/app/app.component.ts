import { Component } from '@angular/core';
import { menuEvents } from './core/menu/menu.component';

/**
 * Master Component for all pages,
 * embeds always on components like navbar and router outlet
 */
@Component({
  selector: 'urlaubplaner-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  {

  /**
   * Method that handles the emitted Events from the Menu Component
   * @param $event event of type menuEvents fired by menu component (e.g. exportLink, save, settingsHolidays,...)
   */
  public handleMenuEvent($event: menuEvents) {
    console.log($event);
  }
}
