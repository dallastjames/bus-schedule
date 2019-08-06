import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  TrackByFunction
} from '@angular/core';
import { Route } from '@bus/models';

@Component({
  selector: 'bus-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteListComponent implements OnInit {
  @Input()
  routes: Route[] = [];
  @Output()
  toggleRoute: EventEmitter<Route> = new EventEmitter<Route>();

  constructor() {}

  ngOnInit() {
    console.log('init2');
  }

  trackByFn: TrackByFunction<Route> = (index, item) => item.title;
}
