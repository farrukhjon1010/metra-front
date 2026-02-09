import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgStyle, CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Router} from '@angular/router';
import {GenerationService} from '../../../core/services/generation.service';
import {GenerationType} from '../../../core/models/generation.model';
import {CreateCard} from '../../create/create.data';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [NgStyle, CommonModule, ButtonComponent, DatePipe],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit {

  @Input() card!: CreateCard;
  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  selectedFilter: 'all' | 'photo' | 'video' = 'all';
  generationHistory: any[] = [];

  constructor(
    private router: Router,
    private generationService: GenerationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.loadGenerationsHistory();
  }

  loadGenerationsHistory() {
    this.generationService
      .findByUser(this.UUID, this.selectedFilter)
      .subscribe({
        next: (data) => {
          this.generationHistory = data;
          console.log('Фильтр:', this.selectedFilter);
          console.log('Генерации:', data);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка при загрузке:', err);
        }
      });
  }

  changeFilter(filter: 'all' | 'photo' | 'video') {

    this.selectedFilter = filter;
    this.loadGenerationsHistory();
  }

  navigateToCreate() {
    this.router.navigate(['/create']);
  }

  downloadFile(url: string, type: 'image' | 'video') {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = type === 'image'
          ? 'generation-image.jpg'
          : 'generation-video.mp4';

        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }

  goToUpscale(imageUrl: string, id: string) {
    this.router.navigate(
      ['/history/improving-quality'],
      { state: { imageUrl, id } }
    );
  }


  repeatGeneration(generation: any) {
    this.router.navigate(
      ['/create', generation.type],
      {
        state: {
          id: generation.id,
          prompt: generation.prompt,
          imageUrl: generation.imageURL
        }
      }
    );
  }
}
