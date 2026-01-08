import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-scenes',
  imports: [
    NgForOf
  ],
  templateUrl: './scenes.component.html',
  styleUrl: './scenes.component.css',
})
export class ScenesComponent implements OnInit {
  scenes: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getScenes().subscribe((data: any) => {
      this.scenes = data;
    });
  }
}
