import { Component, computed } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { StackComponent } from '../../ui/stack/stack.component';
import { CommonModule } from '@angular/common';
import { PageComponent } from "../../ui/page/page.component";
import { StateService } from '../../services/state.service';

@Component({
  selector: 'admin-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, StackComponent, PageComponent],
  templateUrl: './admin-page.component.html'
})
export class AdminPageComponent {

  myAccountLink = computed(() => `account/${this.stateService.user().id}`);

  constructor(private stateService: StateService) { }
}
