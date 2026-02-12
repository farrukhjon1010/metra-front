import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SceneService } from '../../../core/services/scene.service';
import { GenerationType } from '../../../core/models/generation.model';
import { Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { Subject, takeUntil } from 'rxjs';
import { Scene } from '../../../core/models/scene.model';

@Component({
  selector: 'app-scenes-card',
  templateUrl: './scenes-card.html',
  styleUrls: ['./scenes-card.scss'],
  standalone: true,
  imports: [ButtonComponent, CommonModule]
})
export class ScenesCard implements OnChanges, OnDestroy {

  @Input() scene: Scene | null = null;
  @Output() back = new EventEmitter<void>();

  templates: any[] = [];
  freestyle: any[] = [];
  displayedTemplates: any[] = [];
  displayedFreestyle: any[] = [];
  templatesStep = 6;
  freestyleStep = 6;
  private destroy$ = new Subject<void>();

  constructor(
    private sceneService: SceneService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scene'] && this.scene) {
      this.loadTemplates();
      this.loadFreestyle();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backToGrid() {
    this.back.emit();
  }

  private loadTemplates() {
    if (!this.scene) {
      return;
    }
    this.templates = [];
    this.displayedTemplates = [];
    this.sceneService.getScenes({ mode: 'Template', categoryId: this.scene.category.id })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Scene[]) => {
          this.templates = data.map(s => ({ name: s.name, prompt: s.prompt }));
          this.displayedTemplates = this.templates.slice(0, this.templatesStep);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to load templates', err)
      });
  }

  private loadFreestyle() {
    if (!this.scene) {
      return;
    }
    this.freestyle = [];
    this.displayedFreestyle = [];
    this.sceneService.getScenes({ mode: 'FreeStyle', categoryId: this.scene.category.id })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Scene[]) => {
          this.freestyle = data.map(s => ({ name: s.name, prompt: s.prompt }));
          this.displayedFreestyle = this.freestyle.slice(0, this.freestyleStep);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to load freestyle', err)
      });
  }

  openTemplate(t: { name: string; prompt: string }) {
    this.router.navigate(['/create', GenerationType.PHOTO_BY_STAGE], {
      state: {
        prompt: t.prompt,
        fromHistory: true
      }
    });
  }

  openFreestyle(f: { name: string; prompt: string }) {
    this.router.navigate(['/create', GenerationType.PHOTO_BY_STAGE], {
      state: {
        prompt: f.prompt,
        fromHistory: true
      }
    });
  }

  showMoreTemplates() {
    const next = this.displayedTemplates.length + this.templatesStep;
    this.displayedTemplates = this.templates.slice(0, next);
  }

  showMoreFreestyle() {
    const next = this.displayedFreestyle.length + this.freestyleStep;
    this.displayedFreestyle = this.freestyle.slice(0, next);
  }
}
