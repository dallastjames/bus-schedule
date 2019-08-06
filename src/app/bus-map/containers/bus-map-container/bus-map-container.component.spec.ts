import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { BusMapContainerComponent } from './bus-map-container.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgxsStateModule } from '@bus/state';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BusMapContainerComponent', () => {
  let component: BusMapContainerComponent;
  let fixture: ComponentFixture<BusMapContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        SharedModule,
        HttpClientTestingModule,
        NgxsStateModule
      ],
      declarations: [BusMapContainerComponent]
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
