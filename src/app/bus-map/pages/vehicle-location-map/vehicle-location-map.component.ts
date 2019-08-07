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
import { Observable, combineLatest, interval, Subject } from 'rxjs';
import { Route } from '@bus/models';
import { startWith, takeUntil } from 'rxjs/operators';

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
  private unsub: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createMap();
    this.createMarkerWatcher();
    this.createIntervalUpdater();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  private createMap() {
    this.map = new google.maps.Map(this.mapEl.nativeElement, {
      center: new google.maps.LatLng(37.7749, -122.4194),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  private createMarkerWatcher() {
    combineLatest(this.selectedRoutes$, this.markers$)
      .pipe(takeUntil(this.unsub))
      .subscribe(
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
      );
  }

  private createIntervalUpdater() {
    interval(15000)
      .pipe(
        startWith(null),
        takeUntil(this.unsub)
      )
      .subscribe(() => this.updateVehiclePositions.emit('sf-muni'));
  }
}
