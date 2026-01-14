import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';

@Component({
  selector: 'app-scenes',
  imports: [],
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.scss'],
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
