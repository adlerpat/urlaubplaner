import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { COMPONENTS } from './components.decl';



@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule, MenubarModule, TabViewModule
  ],
  exports: [
    COMPONENTS
  ]
})
export class CoreModule { }
