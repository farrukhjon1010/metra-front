import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [
    NgForOf
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  history: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getScenes().subscribe((data: any) => {
      this.history = data; // можно фильтровать по статусу "завершено"
    });
  }
}
