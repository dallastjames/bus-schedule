import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
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

  constructor() {}

  ngOnInit() {}
}
