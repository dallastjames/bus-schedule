import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { VehicleLocationMapComponent } from './pages/vehicle-location-map/vehicle-location-map.component';
import { BusMapContainerComponent } from './pages/bus-map-container/bus-map-container.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  exports: [BusMapContainerComponent],
  declarations: [BusMapContainerComponent, VehicleLocationMapComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    SharedModule
  ]
})
export class BusMapModule {}
