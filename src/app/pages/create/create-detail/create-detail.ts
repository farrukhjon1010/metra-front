import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CreateCard} from '../create.component';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Router} from '@angular/router';
import {FileService} from '../../../core/services/file.service';
import {GenerationService} from '../../../core/services/generation.service';
import {CreateGenerationDto, GenerateImageDto, GenerationType} from '../../../core/models/generation.model';
import {switchMap} from 'rxjs';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

type CreateState = 'idle' | 'loading' | 'result';

@Component({
  selector: 'app-create-detail',
  imports: [
    ButtonComponent,
    FormsModule,
    DatePipe
  ],
  standalone: true,
  templateUrl: './create-detail.html',
  styleUrls: ['./create-detail.scss'],
})
export class CreateDetail implements OnInit {

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';

  @Input() card!: CreateCard;
  @Input() initialPrompt: string = '';
  @Input() initialImageUrl: string | null = null;
  @Output() back = new EventEmitter<void>();
  @ViewChild('photoGenerate', {static: false}) photoGenerate!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;
  photos: { generate: string | null } = {generate: null};
  createState: CreateState = 'idle';
  generationHistory: any[] = [];
  resultImageUrl: string | null = null;
  prompt: string = "";

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fileService: FileService,
    private generationService: GenerationService,
    private imageGenService: GenerationService
  ) {
  }

  ngOnInit() {
    this.loadGenerationsHistory();

    if (this.initialPrompt) {
      this.prompt = this.initialPrompt;
    }

    if (this.initialImageUrl) {
      this.photos.generate = this.initialImageUrl;
      this.resultImageUrl = this.initialImageUrl;
    }
  }

  goBack() {
    this.back.emit();
  }

  onPhotoSelected(event: Event, type: 'generate') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type] = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(type: 'generate', event: Event) {
    event.stopPropagation();
    const map = {
      generate: this.photoGenerate,
    };
    map[type]?.nativeElement.click();
  }

  removePhoto(type: 'generate', event: Event) {
    event.stopPropagation();
    this.photos[type] = null;
    this.selectedFile = null;
    this.resultImageUrl = null;
  }

  navigateToHistory() {
    this.router.navigate(['/history'])
  }

  loadGenerationsHistory() {
    this.generationService.findByUser(this.UUID, this.card.type).subscribe({
      next: (data) => {
        this.generationHistory = data;
        this.cdr.detectChanges();
        console.log('Генерации загружены:', data);
      },
      error: (err) => {
        console.error('Ошибка при загрузке:', err);
      }
    });
  }

  createImage() {
    if (!this.selectedFile && this.initialImageUrl) {
      this.createState = 'loading';
      const genDto: GenerateImageDto = {
        type: this.card.type as GenerationType,
        prompt: this.prompt,
        image: this.initialImageUrl
      };

      this.imageGenService.generateImage(genDto).pipe(
        switchMap((genRes: any) => {
          this.resultImageUrl = genRes.processedImage;
          const saveDto: CreateGenerationDto = {
            userId: this.UUID,
            type: this.card.type,
            prompt: this.prompt,
            imageURL: genRes.processedImage,
            externalTaskId: genRes.externalTaskId
          };
          return this.generationService.create(saveDto);
        })
      ).subscribe({
        next: () => {
          this.createState = 'result';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка в цепочке:', err);
          this.createState = 'idle';
          alert('Ошибка генерации. Проверьте URL бэкенда');
          this.cdr.detectChanges();
        }
      });
      return;
    }

    if (!this.selectedFile) return;

    this.createState = 'loading';
    const userId = this.UUID;

    this.fileService.uploadImageGeneration(this.selectedFile, userId).pipe(
      switchMap((uploadRes: any) => {
        const genDto: GenerateImageDto = {
          type: this.card.type as GenerationType,
          prompt: this.prompt,
          image: uploadRes.url
        };
        return this.imageGenService.generateImage(genDto);
      }),
      switchMap((genRes: any) => {
        this.resultImageUrl = genRes.processedImage;
        const saveDto: CreateGenerationDto = {
          userId: userId,
          type: this.card.type,
          prompt: this.prompt,
          imageURL: genRes.processedImage,
          externalTaskId: genRes.externalTaskId
        };
        return this.generationService.create(saveDto);
      })
    ).subscribe({
      next: () => {
        this.createState = 'result';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка в цепочке:', err);
        this.createState = 'idle';
        alert('Ошибка генерации. Проверьте URL бэкенда');
        this.cdr.detectChanges();
      }
    });
  }

}
