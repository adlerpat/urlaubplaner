import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventpickerComponent } from './eventpicker.component';

describe('EventpickerComponent', () => {
  let component: EventpickerComponent;
  let fixture: ComponentFixture<EventpickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventpickerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
