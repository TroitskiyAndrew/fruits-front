import { Component, signal } from '@angular/core';
import { TelegrammService } from '../../services/telegramm.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TICKET_NAMES } from '../../constants/constants';
import { environment } from '../../../environments/environment';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-my-tickets-page',
  imports: [CommonModule],
  templateUrl: './my-tickets-page.component.html',
  styleUrl: './my-tickets-page.component.scss'
})
export class MyTicketsPageComponent {
  ticketNames = TICKET_NAMES;
  backUrl = environment.backendUrl;

  constructor(private apiService: ApiService, private router: Router, public stateService: StateService) {  }
  back() {
    this.router.navigate(['']);
  }

  openTicket(ticket: any){
    if(!ticket.confirmed){
      return;
    }
  }

}
