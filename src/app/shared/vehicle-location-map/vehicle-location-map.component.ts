import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MarkerCollection } from './marker-collection';
import { RouteOptionsService, VehicleLocationsService } from '@bus/services';

declare var google: any;

@Component({
  selector: 'bus-vehicle-location-map',
  templateUrl: './vehicle-location-map.component.html',
  styleUrls: ['./vehicle-location-map.component.scss']
})
export class VehicleLocationMapComponent
  implements OnDestroy, OnInit, AfterViewInit {
  private interval;
  private map;
  private markers: MarkerCollection;
  private vehicleSubscription: Subscription;
  private routeOptionsSubscription: Subscription;

  constructor(
    private routeOptions: RouteOptionsService,
    private vehicleLocations: VehicleLocationsService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createMap();
    this.subscribeToVehicleData();
    this.subscribeToRouteOptionsChanges();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.vehicleSubscription.unsubscribe();
    this.routeOptionsSubscription.unsubscribe();
  }

  private buildMarkers(locs: any) {
    locs.locations.forEach(loc => {
      this.markers.merge(
        loc,
        this.routeOptions.shouldDisplayRoute('sf-muni', loc.routeTag)
      );
    });
  }

  private createMap() {
    this.map = new google.maps.Map(
      document.getElementById('vehicle-location-map'),
      {
        center: new google.maps.LatLng(37.7749, -122.4194),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );
    this.markers = new MarkerCollection(this.map);
  }

  private subscribeToRouteOptionsChanges() {
    this.routeOptionsSubscription = this.routeOptions.changedOptions.subscribe(
      changes =>
        changes.forEach(change =>
          this.routeOptions.shouldDisplayRoute(change.agency, change.route)
            ? this.markers.show(change.route)
            : this.markers.hide(change.route)
        )
    );
  }

  private subscribeToVehicleData() {
    this.vehicleSubscription = this.vehicleLocations.data.subscribe(locs =>
      this.buildMarkers(locs)
    );
    this.vehicleLocations.refresh('sf-muni');
    this.interval = setInterval(
      () => this.vehicleLocations.refresh('sf-muni'),
      15000
    );
  }
}
