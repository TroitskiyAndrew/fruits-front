import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { IUser } from '../../models/models';
import { InputComponent } from '../../ui/input/input.component';
import { StackComponent } from '../../ui/stack/stack.component';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';
import { PriceComponent } from '../../ui/price/price.component';
import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';

@Component({
  selector: 'users-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserCardComponent, InputComponent, StackComponent],
  templateUrl: './users-page.component.html'
})
export class UsersPageComponent {

  search = new FormControl('');

  users: IUser[] = [];

  constructor(
    private router: Router
  ) { }

  openUser(user: IUser) {
    this.router.navigate(['/users', user.userId]);
  }

}
