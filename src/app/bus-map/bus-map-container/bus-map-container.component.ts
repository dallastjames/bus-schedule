import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RoutesState } from '@bus/state';
import { RouteSelection } from '@bus/models';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
  selector: 'bus-map-container',
  templateUrl: './bus-map-container.component.html',
  styleUrls: ['./bus-map-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusMapContainerComponent implements OnInit {
  @Select(RoutesState.routesWithSelectionData)
  routes$: Observable<RouteSelection[]>;
  @Emitter(RoutesState.toggleRoute)
  toggleRoute: Emittable<RouteSelection>;
  @Emitter(RoutesState.loadRoutes)
  loadRoutes: Emittable<string>;

  constructor() {
    this.loadRoutes.emit('sf-muni');
  }

  ngOnInit() {}
}
