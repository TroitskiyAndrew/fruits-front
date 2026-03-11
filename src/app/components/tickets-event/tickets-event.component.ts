import { Component, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../services/state.service';
import { TICKET_NAMES, EVENT_NAMES } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { SearchComponent } from "../search/search.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets-event',
  imports: [CommonModule, FormsModule, SearchComponent],
  templateUrl: './tickets-event.component.html',
  styleUrl: './tickets-event.component.scss'
})
export class TicketsEventComponent {
  payment = false;
  currency: 'VND' | 'RUB' | 'USDT' = 'VND';
  method: 'cash' | 'bank' = 'cash';
  event = signal<any | null>(null);
  tickets = computed(() => {
    const isAdmin = this.stateService.isAdmin();
    const event = this.event() || {};
    const tickets = event.tickets || [];
    if (this.discount) {
      tickets.forEach((ticket: any) => {
        ticket.priceRub = 0.8 * ticket.priceRub;
        ticket.priceUSDT = 0.8 * ticket.priceUSDT;
        ticket.priceVND = 0.8 * ticket.priceVND;
      })
    }
    if (isAdmin) {
      return tickets;
    }
    return tickets.filter((ticket: any) => ticket.type > 0)
  });
  eventNames = EVENT_NAMES;

  sales = signal<any[]>([])
  totalSales = signal<any>({})
  reel = computed(() => {
    const event = this.event();
    return event.type === 0 ? 'https://www.instagram.com/reel/DStbYzaCPpW/' : 'https://www.instagram.com/reel/DStbYzaCPpW/';
  });

  place = computed(() => {
    const event = this.event();
    if (!event) {
      return null;
    }
    return this.stateService.placesMap().get(event.place);
  });
  otherEvents = computed(() => {
    function toMilliseconds(dateStr: string): number {
      const [day, month, year] = dateStr.split('.').map(Number);

      const date = new Date(year, month - 1, day); // месяц с 0
      return date.getTime();
    }
    function toMillisecondsToday(): number {
      const today = new Date();

      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0, 0, 0, 0
      );

      return todayDate.getTime();
    }
    const event = this.event();
    const city = this.stateService.cities().find(city => city.id === event.city);
    const otherEvents = city ? city.events.filter((e: any) => e.type !== event.type && toMilliseconds(e.date) >= toMillisecondsToday()) : [];
    return otherEvents;
  })

  ticketNames = TICKET_NAMES;
  state = signal<any[]>([]);
  totalVND = computed(() => this.state().reduce((sum, item) => sum + item.priceVND, 0) * (this.selectedOtherEvent() ? 1.8 : 1));
  totalRub = computed(() => this.state().reduce((sum, item) => sum + item.priceRub, 0) * (this.selectedOtherEvent() ? 1.8 : 1));
  totalUSDT = computed(() => this.state().reduce((sum, item) => sum + item.priceUSDT, 0) * (this.selectedOtherEvent() ? 1.8 : 1));
  canChange = computed(() => {
    const state = this.state();
    const types = new Set(state.map(ticket => ticket.type));
    return types.size === 1;
  })
  total = 0;
  showInfo = false;
  phone = environment.phone;
  discount = false;

  TON = 'UQDl1wOU_E16LB4qecI_IK2pvZVgJcX8qUUlcFXZjjuJze06'
  TRC20 = 'TKcJ69dbNa4aQ3S2vUrWMAk2N4pHcfX8px';
  showSales = false;
  saleMode = false;
  selectedUser = null;
  isInside = false;
  gotMoney = false;

  constructor(public stateService: StateService, private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  imageLoaded = signal(false);
  ticketsLoaded = signal(false);
  isCashier = signal(false);

  onImageLoad() {
    this.imageLoaded.set(true);
  }

  onImageError() {
    this.imageLoaded.set(true); // чтобы лоадер не крутился вечно
  }

  selectedOtherEvent = signal<any | null>(null);

  selectOtherEvent(event: any) {
    if (this.selectedOtherEvent()?.id === event.id) {
      this.selectedOtherEvent.set(null); // снять выбор
    } else {
      this.selectedOtherEvent.set(event);
    }
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const event = this.stateService.eventsMap().get(id || '');
    if (event) {
      this.event.set({ ...event, tickets: [] });
    }
    const dbEvent = await this.apiService.getEvent(id || '');
    console.log(this.stateService.citiesMap().get(dbEvent.city))
    const eventStr = `${dbEvent.cityName} ${dbEvent.date} ${this.eventNames[dbEvent.type]}`
    this.apiService.saveVisit(dbEvent.city, eventStr);
    if (id === this.stateService.discountEvent) {
      this.discount = true;
    }
    this.event.set(dbEvent);
    if ((dbEvent.cashiers || []).includes(this.stateService.user()?.userId)) {
      this.isCashier.set(true);
    }
    if (this.stateService.isAdmin()) {
      const soldTickets = await this.apiService.getSales(id || '');
      const sales = dbEvent.tickets.map((ticket: any) => {
        const soldTicketsThisType = soldTickets.filter((sale: any) => sale.type === ticket.type);
        return {
          type: ticket.type,
          count: soldTicketsThisType.length,
          totalRub: soldTicketsThisType.filter((sale: any) => sale.currency === 'RUB').reduce((acc: number, sale: any) => acc + sale.price, 0),
          totalVND: soldTicketsThisType.filter((sale: any) => sale.currency === 'VND').reduce((acc: number, sale: any) => acc + sale.price, 0),
          totalUSDT: soldTicketsThisType.filter((sale: any) => sale.currency === 'USDT').reduce((acc: number, sale: any) => acc + sale.price, 0),
        }
      })
      const totalSales = {
        count: soldTickets.length,
        totalRub: Math.round(soldTickets.filter((sale: any) => sale.currency === 'RUB').reduce((acc: number, sale: any) => acc + sale.price, 0) * 100) / 100 ,
        totalVND: Math.round(soldTickets.filter((sale: any) => sale.currency === 'VND').reduce((acc: number, sale: any) => acc + sale.price, 0) * 100) / 100 ,
        totalUSDT: Math.round(soldTickets.filter((sale: any) => sale.currency === 'USDT').reduce((acc: number, sale: any) => acc + sale.price, 0) * 100) / 100 ,
      }
      this.totalSales.set(totalSales)
      this.sales.set(sales);

    }
    this.ticketsLoaded.set(true);

  }

  buyTickets() {
    this.payment = true;
    this.apiService.savePath('press-buy');
    switch (this.currency) {
      case 'RUB':
        this.total = this.totalRub();
        break;
      case 'VND':
        this.total = this.totalVND();
        break;
      case 'USDT':
        this.total = this.totalUSDT();
        break;

    }
  }

  downloadQR() {
    const link = document.createElement('a');
    link.href = 'assets/qr.png';
    link.download = 'qr.png';
    link.click();
  }

  copyPhone() {
    navigator.clipboard.writeText(this.phone).then(() => {
      alert('Номер телефона скопирован в буфер обмена!');
    })
  }
  copyTON() {
    navigator.clipboard.writeText(this.TON).then(() => {
      alert('Адрес TON-кошелька скопирован в буфер обмена!');
    })
  }
  copyTRC20() {
    navigator.clipboard.writeText(this.TRC20).then(() => {
      alert('Адрес TRC20-кошелька скопирован в буфер обмена!');
    })
  }
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('currency', this.currency || '');
    const tickets = this.state().map(ticket => ({
      add: ticket.add,
      eventId: ticket.eventId,
      type: ticket.type,
      price: this.currency === 'VND' ? ticket.priceVND : this.currency === 'USDT' ? ticket.priceUSDT : ticket.priceRub,
      combo: false,
      discount: this.discount,
      source: this.stateService.source || ''
    }));
    const otherEvent = this.selectedOtherEvent();
    if (otherEvent) {
      tickets.push(...tickets.map(ticket => ({
        ...ticket,
        eventId: otherEvent.id,
        price: ticket.price * 0.8,
        add: otherEvent.tickets.find((t: any) => t.type === ticket.type)?.add || '',
        combo: true,
        discount: this.discount,
        source: this.stateService.source || '',
      })));
    }
    formData.append('tickets', JSON.stringify(tickets));
    this.payment = false;
    this.showInfo = true;
    this.apiService.savePath('bought tickets');
    this.stateService.loadingUserTickets = true;
    await this.apiService.byTickets(formData).then(() => this.stateService.updateUserTickets());
  }

  onUserSelected(userId: any) {
    this.selectedUser = userId;
  }

  cancelPayment() {
    this.payment = false;
  }

  back() {
    this.showInfo = false;
  }
  goHome(tour = false) {
    this.router.navigate([''], tour ? { fragment: 'tour' } : {});
  }
  myTickets() {
    this.router.navigate(['my-tickets']);
  }

  goToBot() {
    const tg = (window as any).Telegram?.WebApp;

    tg.openTelegramLink('https://t.me/sverlov_vietnam_2026_bot')
  }

  buyByCash() {
    const cashierUsername = this.event().cashTaker || 's_gruzdova';
    const url = `https://t.me/${cashierUsername}`;
    this.apiService.savePath('buyByCash');
    if ((window as any)?.Telegram?.WebApp) {
      (window as any).Telegram.WebApp.openTelegramLink(url);
    } else {
      // fallback если открыто не внутри Telegram
      window.open(url, '_blank');
    }
  }

  sellByCash() {
    this.saleMode = true;
    switch (this.currency) {
      case 'RUB':
        this.total = this.totalRub();
        break;
      case 'VND':
        this.total = this.totalVND();
        break;
      case 'USDT':
        this.total = this.totalUSDT();
        break;

    }
  }
  cancelSell() {
    this.saleMode = false;
    this.selectedUser = null;
    this.gotMoney = false
    this.isInside = false;
  }

  sellTickets(withUser: boolean) {
    if (!this.gotMoney) {
      alert('Подтверди, что получил наличные от Гостя');
      return
    }
    const state = this.state();
    const tickets = state.map(ticket => ({
      add: ticket.add,
      eventId: ticket.eventId,
      type: ticket.type,
      price: this.currency === 'VND' ? ticket.priceVND : this.currency === 'USDT' ? ticket.priceUSDT : ticket.priceRub,
      combo: false,
      discount: this.discount,
    }));
    if(this.canChange()) {
      tickets.forEach(ticket => {
        ticket.price = this.total / tickets.length
      })
    }

    const otherEvent = this.selectedOtherEvent();
    if (otherEvent) {
      tickets.push(...tickets.map(ticket => ({
        ...ticket,
        eventId: otherEvent.id,
        price: ticket.price * 0.8,
        add: otherEvent.tickets.find((t: any) => t.type === ticket.type)?.add || '',
        combo: true,
        discount: this.discount,
      })));
    }
    this.apiService.sellTickets({
      currency: this.currency,
      tickets,
      userId: withUser ? this.selectedUser : 555,
      cashier: this.stateService.user().userId,
      checked: this.isInside,
      sendTo: withUser ? null : this.stateService.user().userId,
      method: this.method,
    });
    this.cancelSell()
  }

  getCount(type: number): number {
    return this.state().filter((item: any) => item.type === type).length;
  }

  decrease(ticket: any) {
    const state = this.state();
    const index = state.findIndex(item => item.type === ticket.type);

    if (index !== -1) {
      state.splice(index, 1);
    }
    this.state.set([...state]);
  }
  increase(ticket: any) {
    ticket.eventId = this.event().id;
    const state = this.state();
    const current = state.filter(stateTicket => stateTicket.type === ticket.type).length;
    if (ticket.count <= current) {
      alert('Больше нет билетов этой категории :-(');
      return;
    }
    state.push(ticket);
    this.state.set([...state]);
  }

}
