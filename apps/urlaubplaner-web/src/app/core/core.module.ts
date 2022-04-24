import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { COMPONENTS } from './components.decl';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule, MenubarModule, TabViewModule, AvatarModule, AvatarGroupModule, ButtonModule
  ],
  exports: [
    COMPONENTS
  ]
})
export class CoreModule { }
