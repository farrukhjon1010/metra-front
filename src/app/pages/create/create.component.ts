import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-create',
  imports: [CommonModule, RouterOutlet],
  standalone: true,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  showHeader = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.showHeader = this.router.url === '/create';

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showHeader = event.urlAfterRedirects === '/create';
    });
  }
}
