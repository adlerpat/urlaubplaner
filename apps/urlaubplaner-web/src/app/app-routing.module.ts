import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerPageComponent } from './planner/planner-page.component';

const routes: Routes = [
  {
    path: '',
    component: PlannerPageComponent,
    loadChildren: () =>
      import('./planner/planner.module').then((m) => m.PlannerModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
