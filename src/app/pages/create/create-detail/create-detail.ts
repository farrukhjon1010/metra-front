import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenerationService } from '../../../core/services/generation.service';
import {CreateGenerationDto, GenerateImageDto, GenerationType} from '../../../core/models/generation.model';
import {FileService} from '../../../core/services/file.service';
import {switchMap} from 'rxjs';
import {CREATE_CARDS, CreateCard} from '../create.data';
import {ActivatedRoute, Router} from '@angular/router';
import {Location, CommonModule} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';

type CreateState = 'idle' | 'loading' | 'result';

@Component({
  selector: 'app-create-detail',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './create-detail.html',
  styleUrls: ['./create-detail.scss'],
})
export class CreateDetail implements OnInit {

  UUID = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';

  card!: CreateCard;
  createState: CreateState = 'idle';
  prompt = '';
  resultImageUrl: string | null = null;
  generationHistory: any[] = [];
  initialPrompt!: string;
  initialImageUrl!: string | null;
  fromHistory = false;
  selectedFile: File | null = null;
  photos: { generate: string | null } = {generate: null};

  @ViewChild('photoGenerate', {static: false}) photoGenerate!: ElementRef<HTMLInputElement>;
  @ViewChild('promptTextarea') textarea!: ElementRef<HTMLTextAreaElement>;


  constructor(
    private generationService: GenerationService,
    private imageGenService: GenerationService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const type = this.route.snapshot.paramMap.get('type') as GenerationType;
    this.card = CREATE_CARDS.find(c => c.type === type) as CreateCard;

    const navigation = this.router.getCurrentNavigation?.();
    const state = navigation?.extras?.state ?? history.state;

    if (state) {
        this.fromHistory = !!state.fromHistory;
        this.initialPrompt = state.prompt ?? '';
        this.initialImageUrl = state.imageUrl ?? null;
        this.prompt = state.prompt ?? '';
    }

    this.loadGenerationsHistory();
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

  downloadFile(url: string, type: 'image' | 'video') {
    fetch(url)
      .then(res => res.blob())
      .then(n => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(n);

        a.href = objectUrl;
        a.download = type === 'image'
          ? 'generation-image.jpg'
          : 'generation-video.mp4';

        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }

  goToUpscale(imageUrl: string) {
    this.router.navigate(
      ['/history/improving-quality'],
      {state: {imageUrl}}
    );
  }

  repeatGeneration(generation: any) {
    this.prompt = generation.prompt;

    setTimeout(() => {
      const textarea = this.textarea.nativeElement;

      textarea.focus();
      textarea.style.fontStyle = 'normal';
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    });
  }

  downloadResultFile(file: string, type: 'image' | 'video') {
    fetch(file)
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

  editFile() {
    this.createState = 'idle';
    this.photos.generate = this.resultImageUrl;
    this.selectedFile = null;

    this.cdr.detectChanges();

    setTimeout(() => {
      const textarea = this.textarea?.nativeElement;
      if (!textarea) return;

      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    });
  }


  createImage() {
      this.onCreate({
          prompt: this.prompt,
          imageUrl: this.initialImageUrl,
          file: this.selectedFile
      });
  }

  onCreate(data: { prompt: string; imageUrl: string | null; file: File | null }) {
    this.prompt = data.prompt;
    this.startGeneration(data.imageUrl, data.file);
  }

  startGeneration(imageUrl: string | null, file: File | null) {
    this.createState = 'loading';

    if (file) {
      this.fileService.uploadImageGeneration(file, this.UUID).pipe(
        switchMap((upload: any) => {
          const genDto: GenerateImageDto = {
            type: this.card.type as GenerationType,
            prompt: this.prompt,
            image: upload.url
          };
          return this.imageGenService.generateImage(genDto);
        }),
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
          this.loadGenerationsHistory();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка генерации:', err);
          this.createState = 'idle';
          alert('Ошибка генерации. Проверьте URL бэкенда');
          this.cdr.detectChanges();
        }
      });
    } else if (imageUrl) {
      const gDto: GenerateImageDto = {
        type: this.card.type as GenerationType,
        prompt: this.prompt,
        image: imageUrl
      };

      this.imageGenService.generateImage(gDto).pipe(
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
          this.loadGenerationsHistory();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка генерации:', err);
          this.createState = 'idle';
          alert('Ошибка генерации. Проверьте URL бэкенда');
          this.cdr.detectChanges();
        }
      });
    } else {
      console.warn("No image provided for generation");
      this.createState = 'idle';
    }
  }


  loadGenerationsHistory() {
    this.generationService.findByUser(this.UUID).subscribe({
      next: (data) => {
        this.generationHistory = data.filter(
          gen => gen.type === this.card.type
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }



  navigateToHistory() {
    this.router.navigate(['/history']);
  }

  goBack() {
    if (this.createState === 'result') {
      this.editFile();
    } else if (this.fromHistory) {
      this.location.back();
    } else {
      this.router.navigate(['/create']);
    }
  }
}
