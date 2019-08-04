import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { RouteOptionsService } from '../../../core/route-options/route-options.service';
import { RouteItemComponent } from './route-item.component';

class RouteOptionsServiceMock {
  hideRoute(agency: string, route: string) {}
  showRoute(agency: string, route: string) {}
  shouldDisplayRoute(agency: string, route: string): boolean {
    return true;
  }
}

describe('RouteItemComponent', () => {
  let component: RouteItemComponent;
  let fixture: ComponentFixture<RouteItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RouteItemComponent],
      imports: [FormsModule, MatCheckboxModule],
      providers: [{ provide: RouteOptionsService, useClass: RouteOptionsServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteItemComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('on route checked', () => {
    let routeOptions;
    beforeEach(() => {
      routeOptions = fixture.debugElement.injector.get(RouteOptionsService);
      spyOn(routeOptions, 'hideRoute').and.callThrough();
      spyOn(routeOptions, 'showRoute').and.callThrough();
      component.route = { tag: 'ABC', title: 'Seasame Street' };
    });

    it('shows the route', () => {
      component.onRouteChecked(true);
      expect(routeOptions.hideRoute).not.toHaveBeenCalled();
      expect(routeOptions.showRoute).toHaveBeenCalledTimes(1);
      expect(routeOptions.showRoute).toHaveBeenCalledWith('sf-muni', 'ABC');
    });

    it('hides the route', () => {
      component.onRouteChecked(false);
      expect(routeOptions.showRoute).not.toHaveBeenCalled();
      expect(routeOptions.hideRoute).toHaveBeenCalledTimes(1);
      expect(routeOptions.hideRoute).toHaveBeenCalledWith('sf-muni', 'ABC');
    });
  });
});
