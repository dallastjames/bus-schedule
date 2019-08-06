import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bus-bus-map-container',
  templateUrl: './bus-map-container.component.html',
  styleUrls: ['./bus-map-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusMapContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
