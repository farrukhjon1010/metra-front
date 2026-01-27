import {Component} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {filter} from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {

  navItems = [
    {link: '/home', label: 'Главная', icon: 'assets/icons/home.svg'},
    {link: '/create', label: 'Создать', icon: 'assets/icons/create.svg'},
    {link: '/scenes', label: 'Сцены', icon: 'assets/icons/scenes.svg'},
    {link: '/history', label: 'История', icon: 'assets/icons/history.svg'},
    {link: '/profile', label: 'Профиль', icon: 'assets/icons/profile.svg'},
  ];

  activeIndex = 0;

  setActive(index: number) {
    this.activeIndex = index;
  }

  constructor(private router: Router) {
    this.setActiveFromUrl(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveFromUrl(event.urlAfterRedirects);
      });
  }

  private setActiveFromUrl(url: string) {
    const index = this.navItems.findIndex(item =>
      url === item.link || url.startsWith(item.link + '/')
    );

    this.activeIndex = index === -1 ? 0 : index;
  }

}
