import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteListItemComponent } from './route-list-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('RouteListItemComponent', () => {
  let component: RouteListItemComponent;
  let fixture: ComponentFixture<RouteListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [RouteListItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteListItemComponent);
    component = fixture.componentInstance;
    component.route = {
      selected: false,
      tag: '1',
      title: '1-Route'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
