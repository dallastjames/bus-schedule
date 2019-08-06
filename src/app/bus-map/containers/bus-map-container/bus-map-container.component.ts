import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RoutesState } from '@bus/state';
import { Route } from '@bus/models';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
  selector: 'bus-bus-map-container',
  templateUrl: './bus-map-container.component.html',
  styleUrls: ['./bus-map-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusMapContainerComponent implements OnInit {
  @Select(RoutesState.routes)
  routes$: Observable<Route[]>;
  @Emitter(RoutesState.toggleRoute)
  toggleRoute: Emittable<Route>;

  constructor() {}

  ngOnInit() {}
}
