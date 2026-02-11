import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.html',
  styleUrls: ['./loading.scss']
})
export class Loading implements OnInit {

  @Input() texts: string[] = [];
  currentText: string = '';

  ngOnInit() {
    this.currentText = this.texts[0];
  }
}
