import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SceneService } from '../../../core/services/scene.service';
import { GenerationType } from '../../../core/models/generation.model';
import { Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { Subject, takeUntil, finalize } from 'rxjs';
import { Scene } from '../../../core/models/scene.model';
import { HomeHeader } from '../../home/home-header/home-header';
import { PaidDialog } from '../../../shared/paid-dialog/paid-dialog';
import { PaidDialogService } from '../../../core/services/paid-dialog.service';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-scenes-card',
  templateUrl: './scenes-card.html',
  styleUrls: ['./scenes-card.scss'],
  standalone: true,
  imports: [ButtonComponent, CommonModule, HomeHeader, PaidDialog]
})
export class ScenesCard implements OnChanges, OnDestroy {

  @Input() scene: Scene | null = null;
  @Output() back = new EventEmitter<void>();

  templates: Scene[] = [];
  freestyle: Scene[] = [];
  displayedTemplates: Scene[] = [];
  displayedFreestyle: Scene[] = [];
  templatesStep = 6;
  freestyleStep = 6;
  loadingCount = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private sceneService: SceneService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public paidDialogService: PaidDialogService,
    private toast: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scene'] && this.scene?.category?.id) {
      this.loadingCount = 2;
      this.loadTemplates();
      this.loadFreestyle();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isHomeScenes(): boolean {
    return this.router.url.startsWith('/home/scenes');
  }

  get isLoading(): boolean {
    return this.loadingCount > 0;
  }

  get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  backToGrid() {
    this.back.emit();
  }

  private loadTemplates() {
    if (!this.scene?.category?.id) {
      this.loadingCount--;
      this.cdr.detectChanges();
      return;
    }
    this.sceneService.getScenes({
      mode: 'Template',
      categoryId: this.scene.category.id
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingCount--;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data: Scene[]) => {
          this.templates = data;
          this.displayedTemplates = this.templates.slice(0, this.templatesStep);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Не удалось загрузить Templates', err);
          this.toast.show('Не удалось загрузить Templates', 'error');
          this.cdr.detectChanges();
        }
      });
  }

  private loadFreestyle() {
    if (!this.scene?.category?.id) {
      this.loadingCount--;
      this.cdr.detectChanges();
      return;
    }
    this.sceneService.getScenes({
      mode: 'FreeStyle',
      categoryId: this.scene.category.id
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingCount--;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data: Scene[]) => {
          this.freestyle = data;
          this.displayedFreestyle = this.freestyle.slice(0, this.freestyleStep);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Не удалось загрузить Freestyle', err);
          this.toast.show('Не удалось загрузить Freestyle', 'error');
          this.cdr.detectChanges();
        }
      });
  }

  openTemplate(scene: Scene) {
    if (!this.paidDialogService.tryShowDialog()) {
      this.router.navigate(['/create', GenerationType.PHOTO_BY_STAGE], {
        state: { prompt: scene.prompt, fromHistory: true }
      });
    }
  }

  openFreestyle(scene: Scene) {
    if (!this.paidDialogService.tryShowDialog()) {
      this.router.navigate(['/create', GenerationType.PHOTO_BY_STAGE], {
        state: { prompt: scene.prompt, fromHistory: true }
      });
    }
  }

  showMoreTemplates() {
    const next = this.displayedTemplates.length + this.templatesStep;
    this.displayedTemplates = this.templates.slice(0, next);
    this.cdr.detectChanges();
  }

  showMoreFreestyle() {
    const next = this.displayedFreestyle.length + this.freestyleStep;
    this.displayedFreestyle = this.freestyle.slice(0, next);
    this.cdr.detectChanges();
  }
}
