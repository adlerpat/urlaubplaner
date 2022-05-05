import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationDaysSettingsComponent } from './vacation-days-settings.component';

describe('VacationDaysSettingsComponent', () => {
  let component: VacationDaysSettingsComponent;
  let fixture: ComponentFixture<VacationDaysSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VacationDaysSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationDaysSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
