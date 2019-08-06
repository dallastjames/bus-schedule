import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { NgxsStateModule } from './state/state.module';

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsStateModule],
  providers: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
