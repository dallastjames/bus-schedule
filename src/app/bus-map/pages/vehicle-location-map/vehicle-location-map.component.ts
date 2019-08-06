import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bus-vehicle-location-map',
  templateUrl: './vehicle-location-map.component.html',
  styleUrls: ['./vehicle-location-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleLocationMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
