import { Component } from '@angular/core';
import { PageComponent } from "../../ui/page/page.component";
import { ButtonComponent } from "../../ui/button/button.component";

@Component({
  selector: 'app-order-placed-page',
  imports: [PageComponent, ButtonComponent],
  templateUrl: './order-placed-page.component.html',
  styleUrl: './order-placed-page.component.scss'
})
export class OrderPlacedPageComponent {

}
