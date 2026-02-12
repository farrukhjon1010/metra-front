import {Component, OnDestroy, signal} from '@angular/core';
import {RouterOutlet, Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {BottomNavComponent} from './shared/components/bottom-nav/bottom-nav.component';
import {CommonModule} from '@angular/common';
import {filter, map, mergeMap, Subject, takeUntil} from 'rxjs';
import {HeaderComponent} from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy{
  pageTitle = signal('');
  showHeader = signal(true);
  showBottomNav = signal(true);
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.pageTitle.set(data['title'] || '');
      this.showHeader.set(data['showHeader'] !== false);
    });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateBottomNav(event.urlAfterRedirects);
      });
    this.updateBottomNav(this.router.url);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateBottomNav(url: string) {
    this.showBottomNav.set(!url.startsWith('/splash'));
  }
}
