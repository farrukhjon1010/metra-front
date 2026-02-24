import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-generation-history',
  imports: [ButtonComponent, DatePipe],
  standalone: true,
  templateUrl: './generation-history.html',
  styleUrls: ['./generation-history.scss'],
})
export class GenerationHistory {

  @Input() history: any[] = [];
  @Output() repeat = new EventEmitter<any>();

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  repeatGeneration(generation: any) {
    this.repeat.emit(generation);
    this.cdr.detectChanges();
  }

  downloadFile(url: string, type: 'image' | 'video'): void {
    if (!url) return;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки файла');
        }
        return response.blob();
      })
      .then(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        const extension = type === 'video' ? 'mp4' : blob.type.split('/')[1] || 'jpg';
        a.href = objectUrl;
        a.download = `generation-${type}.${extension}`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Не удалось скачать файл:', err);
        this.cdr.detectChanges();
      });
  }

  goToUpscale(imageUrl: string) {
    this.router.navigate(['/history/improving-quality'], { state: { imageUrl } });
  }

  navigateToHistory() {
    this.router.navigate(['/history']);
  }
}
