import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { COMPONENTS } from './components.decl';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    MenubarModule,
    TabViewModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [COMPONENTS],
})
export class CoreModule {}
