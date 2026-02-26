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

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [NgStyle, CommonModule, ButtonComponent, DatePipe, Loading, PaidDialog],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit, OnDestroy {

  @Input() card!: CreateCard;

  public selectedFilter = signal<'all' | 'photo' | 'video'>('all');
  public generationHistory = signal<any[]>([]);
  public isLoading = signal<boolean>(false);

  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private generationService = inject(GenerationService);
  private paidDialogService = inject(PaidDialogService);
  private toast = inject(ToastService);

  public get shouldShowPaidDialog(): boolean {
    return !this.isLoading() && this.generationHistory().length > 0 && this.paidDialogService.showDialog();
  }

  ngOnInit() {
    this.loadGenerationsHistory();
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
