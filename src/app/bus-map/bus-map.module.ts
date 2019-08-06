import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { VehicleLocationMapComponent } from './pages/vehicle-location-map/vehicle-location-map.component';
import { BusMapContainerComponent } from './containers/bus-map-container/bus-map-container.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BusMapContainerComponent, VehicleLocationMapComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: '',
        component: BusMapContainerComponent,
        children: [
          {
            path: '',
            component: VehicleLocationMapComponent
          }
        ]
      }
    ]),
    SharedModule
  ]
})
export class BusMapModule {}
