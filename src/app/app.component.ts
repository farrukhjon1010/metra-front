import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';
import { routeAnimation } from './shared/animations/route.animations';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeAnimation]
})
export class AppComponent {
  protected readonly title = signal('metra-front');
  showBottomNav = signal(true);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showBottomNav.set(event.url !== '/splash');
      });
    
    this.showBottomNav.set(this.router.url !== '/splash');
  }
}
