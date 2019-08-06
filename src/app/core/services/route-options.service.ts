import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteOptionsService {
  changedOptions: Subject<Array<{ agency: string; route: string }>>;

  private options;

  constructor() {
    // this.options = this.localStorage.get('routeOptions') || {};
    this.options = {};
    this.changedOptions = new Subject();
  }

  hideRoute(agency: string, route: string | Array<string>): void {
    const routes = Array.isArray(route) ? route : [route];
    this.setRouteVisibility(agency, routes, false);
  }

  showRoute(agency: string, route: string | Array<string>): void {
    const routes = Array.isArray(route) ? route : [route];
    this.setRouteVisibility(agency, routes, true);
  }

  shouldDisplayRoute(agency: string, route: string): boolean {
    return this.options[agency] && this.options[agency][route];
  }

  private setRouteVisibility(
    agency: string,
    routes: Array<string>,
    visible: boolean
  ): void {
    this.options[agency] = this.options[agency] || {};
    routes.forEach(route => (this.options[agency][route] = visible));
    this.changedOptions.next(
      routes.map<{ agency: string; route: string }>(r => ({
        agency: agency,
        route: r
      }))
    );
    // this.localStorage.set('routeOptions', this.options);
  }
}
