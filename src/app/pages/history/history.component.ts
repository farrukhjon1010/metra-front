import {ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import {DatePipe, NgStyle} from '@angular/common';
import {ButtonComponent} from '../../shared/components/button/button.component';
import {Router} from '@angular/router';
import {CreateCard} from '../create/create.component';
import {GenerationService} from '../../core/services/generation.service';
import {GenerationType} from '../../core/models/generation.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgStyle, ButtonComponent, DatePipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnChanges, OnInit {

  @Input() card!: CreateCard;
  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  selectedFilter: 'all' | 'photo' | 'video' = 'all';
  generationHistory: any[] = [];

  constructor(
    private router: Router,
    private generationService: GenerationService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadGenerationsHistory();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card'] && this.card) {
      this.loadGenerationsHistory();
    }
  }

  loadGenerationsHistory() {
    const type = this.card?.type;
    this.generationService.findByUser(this.UUID, type).subscribe({
      next: (data) => {
        this.generationHistory = data;
        this.cdr.markForCheck();
        console.log('Генерации загружены:', data);
      },
      error: (err) => {
        console.error('Ошибка при загрузке:', err);
      }
    });
  }

  navigateToCreate() {
    this.router.navigate(['/history/improving-quality']);
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
      })
      .catch(err => {
        console.error('Ошибка загрузки', err);
      });
  }

  goToUpscale(imageUrl: string) {
    this.router.navigate(
      ['/history/improving-quality'],
      {state: {imageUrl}}
    );
  }

  repeatGeneration(generation: any) {
    const generationType: GenerationType = generation.type;

    this.router.navigate(['/create'], {
      state: {
        id: generation.id,
        prompt: generation.prompt,
        imageUrl: generation.imageURL,
        type: generationType
      }
    });
  }

}
