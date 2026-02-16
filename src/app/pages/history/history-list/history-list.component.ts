import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DatePipe, NgStyle, CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Router} from '@angular/router';
import {GenerationService} from '../../../core/services/generation.service';
import {CreateCard} from '../../create/create.data';
import {Subject, takeUntil} from 'rxjs';
import {Loading} from "../../../shared/components/loading/loading";

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [NgStyle, CommonModule, ButtonComponent, DatePipe, Loading],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit, OnDestroy {

  @Input() card!: CreateCard;
  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  selectedFilter: 'all' | 'photo' | 'video' = 'all';
  generationHistory: any[] = [];
  private destroy$ = new Subject<void>();
  isLoading = false;

  constructor(
    private router: Router,
    private generationService: GenerationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadGenerationsHistory();
  }

  loadGenerationsHistory() {
    this.isLoading = true;
    this.generationService
      .findByUser(this.UUID, this.selectedFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.generationHistory = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка при загрузке:', err);
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
