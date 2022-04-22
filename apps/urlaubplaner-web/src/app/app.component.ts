import { Component } from '@angular/core';
import { menuEvents } from './core/menu/menu.component';

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
