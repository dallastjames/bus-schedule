import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';

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
      developmentMode: !environment.production,
      selectorOptions: {
        injectContainerState: false,
        suppressErrors: false
      }
    }),
    NgxsStoragePluginModule.forRoot(),
    NgxsEmitPluginModule.forRoot(),
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
