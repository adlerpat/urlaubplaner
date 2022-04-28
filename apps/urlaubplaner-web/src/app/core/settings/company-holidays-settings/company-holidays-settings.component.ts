import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompanyHolidayPreset, wieHDMPreset } from './company-holidays-presets.helper';

/** 
 * company holiday settings view component, communicates to settings component via event emitter
 */
@Component({
  selector: 'urlaubplaner-company-holidays-settings',
  templateUrl: './company-holidays-settings.component.html',
  styleUrls: ['./company-holidays-settings.component.scss'],
})
export class CompanyHolidaysSettingsComponent implements OnInit {
  /** list of company holiday presets to render in template as options */
  private _presets: CompanyHolidayPreset[] = [wieHDMPreset];
  /** current selected company holiday preset shorthand */
  private _selectedShortHand = "";
  
  /** input of already selected option */
  @Input() selectedCompanyHolidayOption!: BehaviorSubject<string | null>;

  /** pass settings to settings component parent */
  @Output() settingsFeedback: EventEmitter<CompanyHolidayPreset> = new EventEmitter<
  CompanyHolidayPreset
  >();

  /** sets shorthand of selectedcompanyholidayoption to current selected shorthand */
  ngOnInit(){
    if(this.selectedCompanyHolidayOption.value){
      this._selectedShortHand = this.selectedCompanyHolidayOption.value;
    }
  }
  /** expose companyholiday presets to template to iterate over to generate selection */
  get presets(): CompanyHolidayPreset[] {
    return this._presets;
  }
  /** exposes selectedshorthand of selected company holiday preset to template*/
  get selectedShortHand(){
    return this._selectedShortHand;
  }
  /** fired by template button selection from template, emits preset if selected else empty preset */
  sendOption(preset: CompanyHolidayPreset) {
    if(this._selectedShortHand === preset.shortHand){
      this._selectedShortHand = "";
      this.settingsFeedback.emit({holidayDays: [new Date("1111-11-11")], label: "", shortHand: "", year: 0});
    }else if(preset){
      this._selectedShortHand = preset.shortHand;
      this.settingsFeedback.emit(preset);
    }else{
      this.settingsFeedback.emit({holidayDays: [new Date("1111-11-11")], label: "", shortHand: "", year: 0});
    }
  }
}
