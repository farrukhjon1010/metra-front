import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CreateCard } from '../../create.data';
import { GenerationService } from '../../../../core/services/generation.service';
import { PaidDialogService } from '../../../../core/services/paid-dialog.service';
import { PaidDialog } from '../../../../shared/paid-dialog/paid-dialog';
import { ToastService } from '../../../../core/services/toast.service';
import { signal, computed } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

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

  public prompt = signal('');
  public photosGenerate = signal<string | null>(null);
  public isLoadingPrompt = signal(false);
  private selectedFile = signal<File | null>(null);
  public showPaidDialog = computed(() => this.paidDialogService.showDialog());

  private destroy$ = new Subject<void>();
  private generationService = inject(GenerationService);
  public paidDialogService = inject(PaidDialogService);
  private toast = inject(ToastService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialPrompt']) {
      this.prompt.set(this.initialPrompt || '');
    }
    if (changes['initialImageUrl']) {
      this.photosGenerate.set(this.initialImageUrl || null);
      this.selectedFile.set(null);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createImage() {
    if (this.paidDialogService.tryShowDialog()) return;
    if (!this.prompt().trim()) {
      this.toast.show('Введите описание (prompt)', 'error');
      return;
    }
    if (!this.photosGenerate() && !this.selectedFile()) {
      this.toast.show('Добавьте изображение', 'error');
      return;
    }
    this.create.emit({
      prompt: this.prompt(),
      imageUrl: this.photosGenerate(),
      file: this.selectedFile()
    });
  }

  removePhoto(type: 'generate', event: Event) {
    event.stopPropagation();
    this.photosGenerate.set(null);
    this.selectedFile.set(null);
    this.toast.show('Фото удалено');
  }

  triggerFileInput(type: 'generate', event: Event) {
    event.stopPropagation();
    const map = { generate: this.photoGenerate };
    map[type]?.nativeElement.click();
  }

  onPhotoSelected(event: Event, type: 'generate') {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.photosGenerate.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  generatePrompt(): void {
    if (this.paidDialogService.tryShowDialog()) return;
    if (!this.card?.type || this.isLoadingPrompt()) {
      this.toast.show('Невозможно сгенерировать prompt', 'error');
      return;
    }

    this.isLoadingPrompt.set(true);
    this.generationService.getPrompt(this.card.type)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.prompt.set(res.prompt);
          this.toast.show('Prompt успешно сгенерирован!', 'success');

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
        },
        complete: () => {
          this.isLoadingPrompt.set(false);
        }
      });
  }
}
