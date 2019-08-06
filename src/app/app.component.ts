import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { RouteOptionsService, RoutesService } from '@bus/services';
import { Route } from '@bus/models';

@Component({
  selector: 'bus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  routes: Array<Route>;

  private routesSubsciption: Subscription;

  constructor(
    private routeOptions: RouteOptionsService,
    private routesService: RoutesService
  ) {}

  ngOnInit() {
    this.routesService.data.subscribe(r => {
      this.routes = r.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      // this.routes.forEach(route => this.routeOptions.showRoute('sf-muni', route.tag));
    });
    this.routesService.refresh('sf-muni');
  }

  ngOnDestroy() {
    this.routesSubsciption.unsubscribe();
  }
}
