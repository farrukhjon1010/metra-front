import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenerationService } from '../../../core/services/generation.service';
import {CreateGenerationDto, GenerateImageDto, GenerationType} from '../../../core/models/generation.model';
import {FileService} from '../../../core/services/file.service';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {CREATE_CARDS, CreateCard} from '../create.data';
import {ActivatedRoute, Router} from '@angular/router';
import {Location, CommonModule} from '@angular/common';
import {CreateHeader} from './create-header/create-header';
import {CreateIdle} from './create-idle/create-idle';
import {CreateResult} from './create-result/create-result';
import {GenerationHistory} from './generation-history/generation-history';
import {Loading} from '../../../shared/components/loading/loading';

type CreateState = 'idle' | 'loading' | 'result';

@Component({
  selector: 'app-create-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, CreateHeader, CreateIdle, CreateResult, GenerationHistory, Loading],
  templateUrl: './create-detail.html',
  styleUrls: ['./create-detail.scss'],
})
export class CreateDetail implements OnInit, OnDestroy {

  card!: CreateCard;
  createState: CreateState = 'idle';
  prompt = '';
  resultImageUrl: string | null = null;
  generationHistory: any[] = [];
  initialPrompt!: string;
  initialImageUrl!: string | null;
  fromHistory = false;
  private destroy$ = new Subject<void>();

  constructor(
    private generationService: GenerationService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const type = this.route.snapshot.paramMap.get('type') as GenerationType;
    this.card = CREATE_CARDS.find(c => c.type === type) as CreateCard;

    const state = history.state;
    if (state) {
        this.fromHistory = !!state.fromHistory;
        this.initialPrompt = state.prompt ?? '';
        this.initialImageUrl = state.imageUrl ?? null;
        this.prompt = state.prompt ?? '';
    }
    this.loadGenerationsHistory();
  }

  repeatGeneration(generation: any) {
    this.prompt = generation.prompt;
    this.initialImageUrl = generation.imageURL;
    this.createState = 'idle';
  }

  onCreate(data: { prompt: string; imageUrl: string | null; file: File | null }) {
    this.prompt = data.prompt;
    this.startGeneration(data.imageUrl, data.file);
  }

  startGeneration(imageUrl: string | null, file: File | null) {
    this.createState = 'loading';

    const handleGeneration = (imgUrl: string) => {
      const genDto: GenerateImageDto = {
        type: this.card.type as GenerationType,
        prompt: this.prompt,
        image: imgUrl
      };

      return this.generationService.generateImage(genDto).pipe(
        switchMap((genRes: any) => {
          this.resultImageUrl = genRes.processedImage;

          const saveDto: CreateGenerationDto = {
            type: this.card.type,
            prompt: this.prompt,
            imageURL: genRes.processedImage,
            externalTaskId: genRes.externalTaskId
          };
          return this.generationService.create(saveDto);
        })
      );
    };

    const source$ = file
      ? this.fileService.uploadImageGeneration(file)
        .pipe(switchMap((upload: any) => handleGeneration(upload.url)))
      : handleGeneration(imageUrl!);

    source$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.createState = 'result';
          this.loadGenerationsHistory();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка генерации:', err);
          this.createState = 'idle';
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadGenerationsHistory() {
    this.generationService.findByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.generationHistory = data.filter(gen => gen.type === this.card.type);
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
  }

  goBack() {
    if (this.createState === 'result') {
      this.createState = 'idle';
    } else if (this.fromHistory) {
      this.location.back();
    } else {
      this.router.navigate(['/create']);
    }
  }

  onEditResult() {
    this.createState = 'idle';
    this.initialImageUrl = this.resultImageUrl;
  }

  onCreateAnother() {
    this.createState = 'idle';
    this.prompt = '';
    this.initialImageUrl = null;
    this.resultImageUrl = null;
  }
}
