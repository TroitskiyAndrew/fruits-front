import { Component, signal } from '@angular/core';
import { PageComponent } from "../../ui/page/page.component";
import { UserCardComponent } from "../../components/user-card/user-card.component";
import { IUser } from '../../models/models';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-account-page',
  imports: [PageComponent, UserCardComponent],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss'
})
export class AccountPageComponent {

  userSignal = signal<IUser | null>(null);

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('userId') || '';
    const user = await this.apiService.getUser(id);
    if (user) {
      this.userSignal.set(user);
    }
  }

}
