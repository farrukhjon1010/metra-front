import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { DatePipe } from '@angular/common';
import { Loading } from '../../../shared/components/loading/loading';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import { ToastService } from '../../../core/services/toast.service';
import { GenerationService } from '../../../core/services/generation.service';
import { Subject, takeUntil } from 'rxjs';
import { CreateCard } from '../../create/create.data';
import {ImageViewerComponent} from './image-viewer/image-viewer';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [NgStyle, CommonModule, ButtonComponent, DatePipe, Loading, PaidDialog, ImageViewerComponent],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit, OnDestroy {

  @Input() card!: CreateCard;
  filters: { key: 'all' | 'photo' | 'video', label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'photo', label: 'Фото' },
    { key: 'video', label: 'Видео' }
  ];
  public selectedFilter = signal<'all' | 'photo' | 'video'>('all');
  public generationHistory = signal<any[]>([]);
  public isLoading = signal<boolean>(false);
  public viewingGenerationSignal = signal<string | null>(null);

  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private generationService = inject(GenerationService);
  private paidDialogService = inject(PaidDialogService);
  private toast = inject(ToastService);

  public get shouldShowPaidDialog(): boolean {
    return !this.isLoading() && this.generationHistory().length > 0 && this.paidDialogService.showDialog();
  }

  openImageViewer(generation: any) {
    this.viewingGenerationSignal.set(generation);
  }

  closeImageViewer() {
    this.viewingGenerationSignal.set(null);
  }

  ngOnInit() {

    const testGeneration = {
      id: 'test123',
      createdAt: new Date().toISOString(),
      category: 'Фото',
      prompt: 'Тестовое изображение для проверки увеличения',
      imageURL: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      type: 'photo'
    };
    this.loadGenerationsHistory();
    setTimeout(() => {
      const currentHistory = this.generationHistory();
      this.generationHistory.set([testGeneration, ...currentHistory]);
    }, 500);
  }

  getSliderTransform(): string {
    const index = this.filters.findIndex(f => f.key === this.selectedFilter());
    return `translateX(${index * 100}%)`;
  }

  changeFilter(filter: 'all' | 'photo' | 'video') {
    this.selectedFilter.set(filter);
    this.loadGenerationsHistory();
  }

  loadGenerationsHistory() {
    this.isLoading.set(true);

    this.generationService
      .findByUser(this.selectedFilter())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.generationHistory.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Ошибка загрузки Истории:', err);
          this.isLoading.set(false);
          this.toast.show('Ошибка загрузки Истории', 'error');
        }
      });
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
        a.download = type === 'image' ? 'generation-image.jpg' : 'generation-video.mp4';
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
      .catch(err => {
        console.error('Ошибка скачивания файла:', err);
        this.toast.show('Ошибка скачивания файла', 'error');
      });
  }

  goToUpscale(imageUrl: string, id: string) {
    if (this.paidDialogService.tryShowDialog()) return;
    this.router.navigate(
      ['/history/improving-quality'],
      { state: { imageUrl, id } }
    );
  }

  reloadHistory() {
    this.loadGenerationsHistory();
  }

  repeatGeneration(generation: any) {
    if (this.paidDialogService.tryShowDialog()) return;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
