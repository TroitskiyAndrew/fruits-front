import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  finalize,
  filter
} from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {

  searchControl = new FormControl('');
  @Output() userSelected = new EventEmitter<any>();
  results: any[] = [];
  loading = false;
  error429 = false;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.searchControl.valueChanges.pipe(

      debounceTime(300),

      distinctUntilChanged(),



      switchMap(value => {
        if (!value || !value.trim()) {
          this.results = [];
          return of([]);
        }
        this.loading = true;
        this.error429 = false;

        return this.apiService.findUsers(value).pipe(
          finalize(() => this.loading = false)
        );
      }),

      takeUntil(this.destroy$)

    ).subscribe({
      next: data => {
        this.results = data;
      },
      error: err => {
        if (err.status === 429) {
          this.error429 = true;
        }
      }
    });
  }

  clearInput() {
    this.searchControl.setValue('');
    this.results = [];
    this.userSelected.emit(null);
  }

  selectItem(item: any) {
    this.searchControl.setValue(item.name, { emitEvent: false });
    this.results = [];

    this.userSelected.emit(item.userId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
