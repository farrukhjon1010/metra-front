import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-generation-history',
  imports: [
    ButtonComponent,
    DatePipe
  ],
  standalone: true,
  templateUrl: './generation-history.html',
  styleUrls: ['./generation-history.scss'],
})
export class GenerationHistory {

  @Input() history: any[] = [];
  @Output() repeat = new EventEmitter<any>();

  constructor(private router: Router) {
  }

  repeatGeneration(generation: any) {
    this.repeat.emit(generation);
  }

  downloadFile(url: string, type: 'image' | 'video') {
    fetch(url)
      .then(res => res.blob())
      .then(n => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(n);

        a.href = objectUrl;
        a.download = type === 'image'
          ? 'generation-image.jpg'
          : 'generation-video.mp4';

        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }

  goToUpscale(imageUrl: string) {
    this.router.navigate(
      ['/history/improving-quality'],
      {state: {imageUrl}}
    );
  }

  navigateToHistory() {
    this.router.navigate(['/history'])
  }
}
