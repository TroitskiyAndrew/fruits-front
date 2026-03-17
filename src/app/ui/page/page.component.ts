import { Component, Input } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-page',
  standalone: true,
  template: ``,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  @Input() showBack: boolean = true;

  constructor(private location: Location){}

  goBack(){
    this.location.back()
  }
}
