import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GenerationHistory} from '../generation-history/generation-history';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {CreateCard} from '../../create.data';

@Component({
  selector: 'app-create-idle',
  imports: [
    FormsModule,
    ButtonComponent,
    GenerationHistory
  ],
  standalone: true,
  templateUrl: './create-idle.html',
  styleUrls: ['./create-idle.scss'],
})
export class CreateIdle implements OnInit {

  @Input() card!: CreateCard;
  @Input() initialPrompt: string = '';
  @Input() initialImageUrl: string | null = null;
  @Input() generationHistory: any[] = [];

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

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.initialPrompt) {
      this.prompt = this.initialPrompt;
    }
    if (this.initialImageUrl) {
      this.photos.generate = this.initialImageUrl;
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
    const el = (event.target as HTMLInputElement)?.files?.[0];
    if (!el) return;

    this.selectedFile = el;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type] = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(el);
  }

  onRepeat(generation: any) {
    this.prompt = generation.prompt;
    this.cdr.detectChanges();

    setTimeout(() => {
      if (this.textarea) {
        this.textarea.nativeElement.focus();
        this.textarea.nativeElement.selectionStart = this.textarea.nativeElement.selectionEnd = this.textarea.nativeElement.value.length;
      }
    });
  }
}
