import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { TicketsEventComponent } from './components/tickets-event/tickets-event.component';
import { MyTicketsPageComponent } from './components/my-tickets-page/my-tickets-page.component';
import { TicketPageComponent } from './components/ticket-page/ticket-page.component';
import { TargetComponent } from './components/target/target.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent
  },
  {
    path: 'event/:id',
    component: TicketsEventComponent
  },
  {
    path: 'check-ticket/:id',
    component: TicketPageComponent
  },
  {
    path: 'my-tickets',
    component: MyTicketsPageComponent
  },
  {
    path: '**',
    component: TargetComponent
  },
];
