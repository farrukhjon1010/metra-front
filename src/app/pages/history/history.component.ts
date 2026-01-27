import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {NgStyle} from '@angular/common';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-history',
  imports: [NgStyle, ButtonComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {

  selectedFilter: 'all' | 'photo' | 'video' = 'all';
  history: any[] = [];

  constructor(private api: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.api.getScenes().subscribe((data: any) => {
      this.history = data;
    });
  }

  navigateToCreate() {
    this.router.navigate(['/history/improving-quality']);
  }
}
