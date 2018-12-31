import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HawaiiMapComponent } from './hawaii-map.component';

describe('HawaiiMapComponent', () => {
  let component: HawaiiMapComponent;
  let fixture: ComponentFixture<HawaiiMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HawaiiMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HawaiiMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
