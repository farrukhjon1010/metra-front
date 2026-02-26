import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit, OnDestroy {

  public activeIndex = signal(0);
  public navItems = [
    { link: '/home', label: 'Главная', icon: 'assets/icons/home.svg' },
    { link: '/create', label: 'Создать', icon: 'assets/icons/create.svg' },
    { link: '/scenes', label: 'Сцены', icon: 'assets/icons/scenes.svg' },
    { link: '/history', label: 'История', icon: 'assets/icons/history.svg' },
    { link: '/profile', label: 'Профиль', icon: 'assets/icons/profile.svg' },
  ];
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  ngOnInit() {
    this.setActiveFromUrl(this.router.url);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.setActiveFromUrl(event.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActive(index: number) {
    const item = this.navItems[index];

    if (this.activeIndex() === index) {
      this.router.navigateByUrl(item.link, { replaceUrl: true });
    } else {
      this.router.navigateByUrl(item.link);
      this.activeIndex.set(index); // обновляем сигнал
    }
  }

  private setActiveFromUrl(url: string) {
    const index = this.navItems.findIndex(item =>
      url === item.link || url.startsWith(item.link + '/')
    );
    this.activeIndex.set(index === -1 ? 0 : index);
  }
}
