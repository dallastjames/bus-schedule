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
import { Observable, interval, Subject } from 'rxjs';
import { VehicleLocation, RouteSelection } from '@bus/models';
import { startWith, takeUntil, withLatestFrom } from 'rxjs/operators';
import { MarkerCollection } from './marker-collection';

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
  @Select(RoutesState.currentAgency)
  currentAgency$: Observable<string>;
  @Select(RoutesState.lastToggledRoutes)
  toggledRoutes$: Observable<RouteSelection[]>;
  @Select(RoutesState.selectedRouteTags)
  selectedRouteTags$: Observable<string[]>;
  @Select(VehiclesState.vehicleInformation)
  vehicles$: Observable<VehicleLocation[]>;

  private map: google.maps.Map;
  private unsub: Subject<void> = new Subject<void>();
  private markerCollection: MarkerCollection;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createMap();
    this.createIntervalUpdater();
    this.createMarkerWatcher();
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
    this.markerCollection = new MarkerCollection(this.map);
  }

  private createMarkerWatcher() {
    this.vehicles$
      .pipe(
        withLatestFrom(this.selectedRouteTags$),
        takeUntil(this.unsub)
      )
      .subscribe(([vehicleData, selectedRouteTags]) => {
        for (const vehicle of vehicleData) {
          this.markerCollection.merge(
            vehicle,
            selectedRouteTags.includes(vehicle.routeTag)
          );
        }
      });
    this.toggledRoutes$
      .pipe(takeUntil(this.unsub))
      .subscribe(lastToggledRoutes => {
        for (const route of lastToggledRoutes) {
          if (route.selected) {
            this.markerCollection.show(route.tag);
          } else {
            this.markerCollection.hide(route.tag);
          }
        }
      });
  }

  private createIntervalUpdater() {
    interval(15000)
      .pipe(
        startWith(null),
        withLatestFrom(this.currentAgency$),
        takeUntil(this.unsub)
      )
      .subscribe(([_, agency]) => this.updateVehiclePositions.emit(agency));
  }
}
