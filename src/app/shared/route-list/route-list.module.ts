import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

import { RouteListComponent } from './route-list.component';
import { RouteItemComponent } from './route-item/route-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatListModule],
  exports: [RouteListComponent],
  declarations: [RouteListComponent, RouteItemComponent]
})
export class RouteListModule {}
