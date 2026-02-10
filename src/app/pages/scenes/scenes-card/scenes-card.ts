import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {SceneService} from '../../../core/services/scene.service';
import {GenerationType} from '../../../core/models/generation.model';
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-scenes-card',
  templateUrl: './scenes-card.html',
  styleUrls: ['./scenes-card.scss'],
  standalone: true,
  imports: [ButtonComponent, CommonModule]
})
export class ScenesCard implements OnChanges {

  @Input() scene: any | null = null;
  @Output() back = new EventEmitter<void>();

  templates: { name: string; prompt: string }[] = [];
  showFreeStyle: boolean = false;

  constructor(private sceneService: SceneService,
              private cdr: ChangeDetectorRef,
              private router: Router,) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scene'] && this.scene) {
      this.loadTemplates(this.scene.type);
    }
  }

  backToGrid() {
    this.back.emit();
  }

  private loadTemplates(type: string) {
    this.templates = [];
    this.sceneService.getScenes({type}).subscribe({
      next: (data: any[]) => {
        this.templates = data.map(s => ({name: s.name, prompt: s.prompt}));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load scene templates', err);
      }
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

}
