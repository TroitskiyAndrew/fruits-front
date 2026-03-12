import { Component } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { StackComponent } from '../../ui/stack/stack.component';
import { CommonModule } from '@angular/common';
import { PageComponent } from "../../ui/page/page.component";

@Component({
  selector: 'admin-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, StackComponent, PageComponent],
  templateUrl: './admin-page.component.html'
})
export class AdminPageComponent { }
