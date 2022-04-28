import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHolidaysSettingsComponent } from './company-holidays-settings.component';

describe('CompanyHolidaysSettingsComponent', () => {
  let component: CompanyHolidaysSettingsComponent;
  let fixture: ComponentFixture<CompanyHolidaysSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyHolidaysSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyHolidaysSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
