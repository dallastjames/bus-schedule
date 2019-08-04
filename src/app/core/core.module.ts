import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { throwIfAlreadyLoaded } from './module-import-guard';

import { RouteOptionsService } from './route-options/route-options.service';
import { RoutesService } from './routes/routes.service';
import { VehicleLocationsService } from './vehicle-locations/vehicle-locations.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [RouteOptionsService, RoutesService, VehicleLocationsService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
