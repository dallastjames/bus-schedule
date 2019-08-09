import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  TrackByFunction
} from '@angular/core';
import { RouteSelection } from '@bus/models';

@Component({
  selector: 'bus-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteListComponent implements OnInit {
  @Input()
  routes: RouteSelection[] = [];

  // prettier-ignore
  @Output()
  toggleRoute: EventEmitter<RouteSelection>
    = new EventEmitter<RouteSelection>();

  constructor() {}

  ngOnInit() {}

  trackByFn: TrackByFunction<RouteSelection> = (index, item) => item.title;
}
