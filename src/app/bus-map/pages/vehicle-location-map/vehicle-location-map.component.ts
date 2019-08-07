import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { VehiclesState, RoutesState } from '@bus/state';
import { Select } from '@ngxs/store';
import { Observable, Subscription, combineLatest, interval } from 'rxjs';
import { Route } from '@bus/models';
import { startWith } from 'rxjs/operators';

declare var google: any;

@Component({
  selector: 'bus-vehicle-location-map',
  templateUrl: './vehicle-location-map.component.html',
  styleUrls: ['./vehicle-location-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleLocationMapComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vehicleLocationMap', { static: true, read: ElementRef })
  mapEl: ElementRef<HTMLDivElement>;

  @Emitter(VehiclesState.requestUpdate)
  updateVehiclePositions: Emittable<string>;
  @Select(RoutesState.selectedRoutes)
  selectedRoutes$: Observable<Route[]>;
  @Select(VehiclesState.vehicleMarkersByRouteTag)
  markers$: Observable<{ [key: string]: google.maps.Marker[] }>;

  private map: google.maps.Map;
  private markersWatcher: Subscription = new Subscription();

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createMap();
    // If no map was created, then we shouldn't try to add markers
    if (!!this.map) {
      this.markersWatcher.add(
        combineLatest(this.selectedRoutes$, this.markers$).subscribe(
          ([routes, markers]: [
            Route[],
            { [key: string]: google.maps.Marker[] }
          ]) => {
            const selectedRouteTags = routes.map(route => route.tag);
            for (const routeTag of Object.keys(markers)) {
              const showMarker = selectedRouteTags.includes(routeTag);
              for (const marker of markers[routeTag]) {
                marker.setMap(showMarker ? this.map : null);
              }
            }
          }
        )
      );
      this.markersWatcher.add(
        interval(15000)
          .pipe(startWith(null))
          .subscribe(() => this.updateVehiclePositions.emit('sf-muni'))
      );
    }
  }

  ngOnDestroy() {
    if (!!this.markersWatcher) {
      this.markersWatcher.unsubscribe();
    }
  }

  private createMap() {
    this.map = new google.maps.Map(this.mapEl.nativeElement, {
      center: new google.maps.LatLng(37.7749, -122.4194),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }
}
