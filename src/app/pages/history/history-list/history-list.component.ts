import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgStyle, CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { GenerationService } from '../../../core/services/generation.service';
import { CreateCard } from '../../create/create.data';
import { Subject, takeUntil } from 'rxjs';
import { Loading } from "../../../shared/components/loading/loading";
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [NgStyle, CommonModule, ButtonComponent, DatePipe, Loading, PaidDialog],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit, OnDestroy {

  @Input() card!: CreateCard;
  selectedFilter: 'all' | 'photo' | 'video' = 'all';
  generationHistory: any[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private generationService: GenerationService,
    private cdr: ChangeDetectorRef,
    public paidDialogService: PaidDialogService
  ) {}

  get shouldShowPaidDialog(): boolean {
    return !this.isLoading && this.generationHistory.length > 0 && this.paidDialogService.showDialog();
  }

  ngOnInit() {
    this.loadGenerationsHistory();
  }

  loadGenerationsHistory() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.generationService
      .findByUser(this.selectedFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.generationHistory = data;
          this.isLoading = false;
          if (this.generationHistory.length > 0 && this.paidDialogService.tryShowDialog()) {
            this.cdr.detectChanges();
          } else {
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Ошибка при загрузке:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
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
    if (this.paidDialogService.tryShowDialog()) return;
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
      .catch(err => console.error('Ошибка скачивания файла:', err));
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
}
