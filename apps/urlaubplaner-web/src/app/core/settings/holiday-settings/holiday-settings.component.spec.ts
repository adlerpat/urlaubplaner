import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaySettingsComponent } from './holiday-settings.component';

describe('HolidaySettingsComponent', () => {
  let component: HolidaySettingsComponent;
  let fixture: ComponentFixture<HolidaySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HolidaySettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
