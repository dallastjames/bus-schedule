import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
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

  checked: boolean = false;

  constructor() {}

  ngOnInit() {}
}
