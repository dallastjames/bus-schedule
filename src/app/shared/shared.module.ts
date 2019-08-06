import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { components } from './components';

@NgModule({
  imports: [CommonModule, MatListModule, MatCheckboxModule],
  declarations: [...components],
  exports: [...components]
})
export class SharedModule {}
