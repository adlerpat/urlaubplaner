import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/angular';
import { BehaviorSubject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

/**
 * Service that fetches holidays from a free api and manages state
 */
@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  /** base api endpoint of public holiday api */
  private _holidaysApi = 'https://get.api-feiertage.de';

  /** current year data */
  private _holidaysY0$: BehaviorSubject<EventInput[]> = new BehaviorSubject<
    EventInput[]
  >([]);
  /** current year + 1 data */
  private _holidaysY1$: BehaviorSubject<EventInput[]> = new BehaviorSubject<
    EventInput[]
  >([]);
  /** current year + 2 data */
  private _holidaysY2$: BehaviorSubject<EventInput[]> = new BehaviorSubject<
    EventInput[]
  >([]);

  /**
   * currently only provides injections
   * @param logger injected to log debug and error messages
   * @param http injected to get holiday data from api
   * @param route injected to get queryParams from url
   */
  constructor(
    private logger: NGXLogger,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    //
  }

  /** access current year data */
  get holidaysY0$() {
    return this._holidaysY0$;
  }
  /** access current year + 1 data */
  get holidaysY1$() {
    return this._holidaysY1$;
  }
  /** access current year + 2 data */
  get holidaysY2$() {
    return this._holidaysY2$;
  }

  /** fetches holiday data from public free api, queries for state param in url */
  public getHolidays() {
    this.logger.debug('HolidaysService.getHolidays called');
    this.route.queryParams.subscribe({
      next: (params) => {
        let requestUrl = this._holidaysApi;
        if (params['states']) {
          requestUrl += '?states=' + params['states'];
        }
        this.http.get<any>(requestUrl).subscribe({
          next: (data) => {
            this.logger.debug('HolidaysService.getHolidays: fetched data');
            if (data.status === 'success') {
              const yearsTemps: EventInput[][] = [[], [], []];
              for (const holiday of data.feiertage) {
                const year = new Date().getFullYear();
                if (holiday.date.includes(year)) {
                  yearsTemps[0].push({
                    title: holiday.fname,
                    start: holiday.date,
                    color: '#ffee58',
                    classNames: ['holiday'],
                    editable: false,
                  });
                } else if (holiday.date.includes(year + 1)) {
                  yearsTemps[1].push({
                    title: holiday.fname,
                    start: holiday.date,
                    color: '#ffee58',
                    classNames: ['holiday'],
                    editable: false,
                  });
                } else if (holiday.date.includes(year + 2)) {
                  yearsTemps[1].push({
                    title: holiday.fname,
                    start: holiday.date,
                    color: '#ffee58',
                    classNames: ['holiday'],
                    editable: false,
                  });
                }
              }
              this._holidaysY0$.next(yearsTemps[0]);
              this._holidaysY1$.next(yearsTemps[1]);
              this._holidaysY2$.next(yearsTemps[2]);
              this.logger.debug(
                'HolidaysService.getHolidays: Pushed Data to Observables'
              );
            } else {
              this.logger.error(
                'HolidaysService.getHolidays: Data Error, status not successfull'
              );
            }
          },
          error: (error) => {
            this.logger.error(
              'HolidaysService.getHolidays: HTTP Request Error'
            );
            this.logger.error(error);
          },
        });
      },
    });
  }
}
