import { Component, OnInit } from '@angular/core';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { RoutesState } from '@bus/state';

@Component({
  selector: 'bus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Emitter(RoutesState.loadRoutes)
  loadRoutes: Emittable<string>;

  constructor() {
    this.loadRoutes.emit('sf-muni');
  }

  ngOnInit() {}
}
