import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLocationMapComponent } from './vehicle-location-map.component';

describe('VehicleLocationMapComponent', () => {
  let component: VehicleLocationMapComponent;
  let fixture: ComponentFixture<VehicleLocationMapComponent>;

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
      declarations: [VehicleLocationMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLocationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
