import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { RouteSelection } from '@bus/models';

@Component({
  selector: 'bus-route-list-item',
  templateUrl: './route-list-item.component.html',
  styleUrls: ['./route-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteListItemComponent implements OnInit {
  @Input()
  route: RouteSelection;
  @Output()
  toggle: EventEmitter<RouteSelection> = new EventEmitter<RouteSelection>();

  constructor() {}

  ngOnInit() {}
}
