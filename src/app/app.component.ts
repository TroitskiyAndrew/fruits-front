import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { StateService } from './services/state.service';
import { TelegrammService } from './services/telegramm.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fruits-front';
  constructor(private stateService: StateService, private telegrammService: TelegrammService, private router: Router, private apiService: ApiService) {
    this.stateService.init();
  }

  ngOnInit() {
    if (this.telegrammService.startParam) {
      const params = this.telegrammService.startParam.split('_SEP_');
      for(const paramStr of params) {
        const [param, value] = paramStr.split('_SPLIT_');
        switch (param) {
          case 'EVENT':
            this.router.navigate(['event', value]);
            break;
          case 'TICKET':
            this.router.navigate(['check-ticket', value]);
            break;
          case 'SESSION':
            this.stateService.sessionId = value;
            this.apiService.getCities();
            break;
          case 'SOURCE':
            this.apiService.saveSource(value);
            break;
          case 'DISCOUNT':
            const [eventId, source] = value.split('_D_');
            this.stateService.discountEvent = eventId;
            this.stateService.source = source || '';
            break;

          default:
            break;
        }

      }
    }
  }
}
