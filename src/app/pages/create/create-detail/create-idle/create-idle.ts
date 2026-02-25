import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CreateCard } from '../../create.data';
import { GenerationService } from '../../../../core/services/generation.service';
import { Subject, takeUntil } from 'rxjs';
import { PaidDialogService } from '../../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../../shared/paid-dialog/paid-dialog';
import {ToastService} from '../../../../core/services/toast.service';

@Component({
  selector: 'app-create-idle',
  standalone: true,
  imports: [FormsModule, ButtonComponent, PaidDialog],
  templateUrl: './create-idle.html',
  styleUrls: ['./create-idle.scss'],
})
export class CreateIdle implements OnChanges, OnDestroy {

  @Input() card!: CreateCard;
  @Input() initialPrompt: string = '';
  @Input() initialImageUrl: string | null = null;
  @Output() create = new EventEmitter<{ prompt: string; imageUrl: string | null; file: File | null }>();
  @ViewChild('photoGenerate', { static: false }) photoGenerate!: ElementRef<HTMLInputElement>;
  @ViewChild('promptTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  selectedFile: File | null = null;
  photos: { generate: string | null } = { generate: null };
  prompt = '';
  isLoadingPrompt = false;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private generationService: GenerationService,
    public paidDialogService: PaidDialogService,
    private toast: ToastService
  ) {}

  get showPaidDialog(): boolean {
    return this.paidDialogService.showDialog();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialPrompt']) {
      this.prompt = this.initialPrompt || '';
      this.cdr.detectChanges();
    }
    if (changes['initialImageUrl']) {
      this.photos.generate = this.initialImageUrl || null;
      this.selectedFile = null;
      this.cdr.detectChanges();
    }
  }

  createImage() {
    if (this.paidDialogService.tryShowDialog()) return;
    if (!this.prompt.trim()) {
      this.toast.show('Введите описание (prompt)', 'error');
      return;
    }
    if (!this.photos.generate && !this.selectedFile) {
      this.toast.show('Добавьте изображение', 'error');
      return;
    }
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
    this.cdr.detectChanges();
  }

  triggerFileInput(type: 'generate', event: Event) {
    event.stopPropagation();
    const map = { generate: this.photoGenerate };
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
    if (this.paidDialogService.tryShowDialog()) return;
    if (!this.card?.type || this.isLoadingPrompt) {
      this.toast.show('Невозможно сгенерировать prompt', 'error');
      return;
    }

    this.isLoadingPrompt = true;
    this.cdr.detectChanges();
    this.generationService.getPrompt(this.card.type)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.prompt = res.prompt;
          this.toast.show('Prompt успешно сгенерирован!', 'success');
          this.cdr.detectChanges();

          setTimeout(() => {
            if (this.textarea) {
              this.textarea.nativeElement.focus();
              const len = this.textarea.nativeElement.value.length;
              this.textarea.nativeElement.selectionStart = len;
              this.textarea.nativeElement.selectionEnd = len;
            }
          });
        },
        error: err => {
          console.error('Ошибка получения prompt:', err);
          this.toast.show('Ошибка генерации Prompt', 'error');
          this.isLoadingPrompt = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.isLoadingPrompt = false;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
