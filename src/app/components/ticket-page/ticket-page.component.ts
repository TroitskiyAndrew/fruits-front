import { Component, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { TICKET_NAMES } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';

enum TicketStatus {
  NoTicket = 'no-ticket',
  Refound = 'refound',
  Inside = 'inside',
  Default = 'default',
}

@Component({
  selector: 'app-ticket-page',
  imports: [CommonModule],
  templateUrl: './ticket-page.component.html',
  styleUrl: './ticket-page.component.scss'
})
export class TicketPageComponent {

  ticket = signal<any | undefined | null>(undefined);
  tickets = signal<any[]>([]);
  ticketNames = TICKET_NAMES;
  TicketStatus = TicketStatus;
  status = computed(() => {
    const ticket = this.ticket();
    if (!ticket) {
      return TicketStatus.NoTicket
    }
    if (ticket.refound) {
      return TicketStatus.Refound
    }
    return ticket.checked ? TicketStatus.Inside : TicketStatus.Default
  });
  isEntrance = computed(() => {
    const ticket = this.ticket();
    if (!ticket) {
      return false;
    }
    const event = this.stateService.eventsMap().get(ticket.event.id);
    if (!event) {
      return false;
    }
    console.log('hasEvent');
    return (event.entrance || []).includes(this.stateService.user().userId)
  });

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private stateService: StateService) {
    effect(async () => {
      const isEntrance = this.isEntrance();
      if (!isEntrance) {
        return;
      }
      const ticket = this.ticket()
      const tickets = await this.apiService.getTicketsByBooking(ticket.bookingId);
      this.tickets.set([
        ticket, ...tickets.filter((bookingTicket) => {
          return bookingTicket.id !== ticket.id && bookingTicket.event.id === ticket.event.id
        })
      ])
    })
  }

  getStatus(ticket: any) {
    if (ticket.refound) {
      return TicketStatus.Refound
    }
    return ticket.checked ? TicketStatus.Inside : TicketStatus.Default
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiService.getTicket(id || '').then(ticket => {
      this.ticket.set(ticket);
    })
  }
  back() {
    this.router.navigate(['']);
  }
  async changeStatus(ticket: any,inside: boolean) {
    const isUpdated = await this.apiService.changeTicketStatus(ticket.id, inside);
    if (isUpdated) {
      ticket.checked = inside;
    }
    const tickets = this.tickets();
    this.tickets.set([...tickets]);
  }
}
