import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {Subject, takeUntil} from 'rxjs';
import {ToastComponent} from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-create',
  imports: [CommonModule, RouterOutlet, ToastComponent],
  standalone: true,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {

  public showHeader = signal(false);
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  ngOnInit() {
    this.showHeader.set (this.router.url === '/create');
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.showHeader.set(event.urlAfterRedirects === '/create');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
