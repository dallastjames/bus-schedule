import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { BusMapContainerComponent } from './bus-map-container.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgxsStateModule } from '@bus/state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VehicleLocationMapComponent } from '../vehicle-location-map/vehicle-location-map.component';

describe('BusMapContainerComponent', () => {
  let component: BusMapContainerComponent;
  let fixture: ComponentFixture<BusMapContainerComponent>;

  beforeAll(() => {
    window['google'] = {
      maps: {
        Animation: {
          BOUNCE: 1,
          DROP: 2
        },
        LatLng: function() {},
        Map: function() {},
        MapTypeId: {
          ROADMAP: 1
        },
        Marker: function() {}
      }
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        SharedModule,
        HttpClientTestingModule,
        NgxsStateModule
      ],
      declarations: [BusMapContainerComponent, VehicleLocationMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusMapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
