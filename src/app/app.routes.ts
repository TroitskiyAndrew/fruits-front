import { Routes } from '@angular/router';
import { TargetComponent } from './components/target/target.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminPageComponent
  },
  {
    path: '**',
    component: TargetComponent
  },
];
