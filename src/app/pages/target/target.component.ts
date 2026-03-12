import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-target',
  imports: [],
  templateUrl: './target.component.html',
  styleUrl: './target.component.scss'
})
export class TargetComponent {

  constructor(private router: Router, private route: ActivatedRoute, private stateService: StateService, private apiService: ApiService) {
    const target = this.route.snapshot.url[0].path;
    if (!this.stateService.target) {
      this.stateService.target = target;
      this.stateService.queryParams = this.route.snapshot.queryParams;
      this.apiService.saveSource(target);
    }
    this.router.navigate([''])
  }
}
