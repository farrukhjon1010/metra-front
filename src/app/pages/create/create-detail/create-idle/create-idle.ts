import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {CreateCard} from '../../create.data';
import {GenerationService} from "../../../../core/services/generation.service";

@Component({
  selector: 'app-create-idle',
  imports: [
    FormsModule,
    ButtonComponent,
  ],
  standalone: true,
  templateUrl: './create-idle.html',
  styleUrls: ['./create-idle.scss'],
})
export class CreateIdle implements OnChanges {

  @Input() card!: CreateCard;
  @Input() initialPrompt: string = '';
  @Input() initialImageUrl: string | null = null;

  @Output() create = new EventEmitter<{
    prompt: string;
    imageUrl: string | null;
    file: File | null;
  }>();

  @ViewChild('photoGenerate', {static: false}) photoGenerate!: ElementRef<HTMLInputElement>;
  @ViewChild('promptTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  selectedFile: File | null = null;
  photos: { generate: string | null } = {generate: null};
  prompt = '';
  isLoadingPrompt = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private generationService: GenerationService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialPrompt']) {
      this.prompt = this.initialPrompt || '';
    }
    if (changes['initialImageUrl']) {
      this.photos.generate = this.initialImageUrl || null;
      this.selectedFile = null;
    }
  }

  createImage() {
    this.create.emit({
      prompt: this.prompt,
      imageUrl: this.photos.generate,
      file: this.selectedFile
    });
  }

  removePhoto(type: 'generate', event: Event) {
    event.stopPropagation();
    this.photos[type] = null;
    this.selectedFile = null;
  }

  triggerFileInput(type: 'generate', event: Event) {
    event.stopPropagation();
    const map = {
      generate: this.photoGenerate,
    };
    map[type]?.nativeElement.click();
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

  generatePrompt(): void {
    if (!this.card?.type || this.isLoadingPrompt) return;

    this.isLoadingPrompt = true;
    this.cdr.detectChanges();

    this.generationService.getPrompt(this.card.type)
        .subscribe({
          next: res => {
            this.prompt = res.prompt;

            setTimeout(() => {
              if (this.textarea) {
                this.textarea.nativeElement.focus();
                const len = this.textarea.nativeElement.value.length;
                this.textarea.nativeElement.selectionStart = len;
                this.textarea.nativeElement.selectionEnd = len;
              }
            });
          },
          error: err => console.error('Ошибка получения prompt:', err),
          complete: () => {
            this.isLoadingPrompt = false;
            this.cdr.detectChanges();
          }
        });
  }
}
