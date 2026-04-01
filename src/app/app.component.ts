import { Component, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { StateService } from './services/state.service';
import { TelegrammService } from './services/telegramm.service';
import { ApiService } from './services/api.service';
import { LoaderDirective } from './ui/loader/loader.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fruits-front';
  loading = computed(() => this.stateService.loading());
  constructor(private stateService: StateService, private telegrammService: TelegrammService, private router: Router, private apiService: ApiService) {
    this.stateService.init();
  }

  ngOnInit() {
    if (this.telegrammService.startParam) {
      const params = this.telegrammService.startParam.split('_SEP_');
      for(const paramStr of params) {
        const [param, value] = paramStr.split('_SPLIT_');
        switch (param) {
          case 'ORDER':
            this.router.navigate(['order', value]);
            break;
          case 'SOURCE':
            this.apiService.saveSource(value);
            break;

          default:
            break;
        }

      }
    }
  }
}
