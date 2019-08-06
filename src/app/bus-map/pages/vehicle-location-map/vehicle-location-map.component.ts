import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

declare var google: any;

@Component({
  selector: 'bus-vehicle-location-map',
  templateUrl: './vehicle-location-map.component.html',
  styleUrls: ['./vehicle-location-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleLocationMapComponent implements OnInit, AfterViewInit {
  @ViewChild('vehicleLocationMap', { static: true, read: ElementRef })
  mapEl: ElementRef<HTMLDivElement>;

  private map: google.maps.Map;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createMap();
  }

  private createMap() {
    this.map = new google.maps.Map(this.mapEl.nativeElement, {
      center: new google.maps.LatLng(37.7749, -122.4194),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }
}
