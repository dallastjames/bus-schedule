import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Route } from '@bus/models';

@Component({
  selector: 'bus-route-list-item',
  templateUrl: './route-list-item.component.html',
  styleUrls: ['./route-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteListItemComponent implements OnInit {
  @Input()
  route: Route;
  @Output()
  toggle: EventEmitter<Route> = new EventEmitter<Route>();

  constructor() {}

  ngOnInit() {
    console.log('init');
  }
}
