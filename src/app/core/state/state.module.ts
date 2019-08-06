import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';

import { throwIfAlreadyLoaded } from '../module-import-guard';
import { environment } from '@bus/env';

import { RoutesState } from './routes.state';
import { VehiclesState } from './vehicles.state';

// Export States Here
export { RoutesState, VehiclesState };

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([RoutesState, VehiclesState], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot(),
    NgxsEmitPluginModule.forRoot(),
    NgxsDispatchPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    })
  ],
  providers: []
})
export class NgxsStateModule {
  constructor(@Optional() @SkipSelf() parentModule: NgxsStateModule) {
    throwIfAlreadyLoaded(parentModule, 'NgxsStateModule');
  }
}
