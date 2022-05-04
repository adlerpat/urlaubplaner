import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannerPageComponent } from './planner-page.component';
import { MonthviewComponent } from './monthview/monthview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarModule } from 'primeng/calendar';
import { ContextMenuModule } from 'primeng/contextmenu';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [PlannerPageComponent, MonthviewComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    FullCalendarModule,
    ContextMenuModule,
  ],
})
export class PlannerModule {}
