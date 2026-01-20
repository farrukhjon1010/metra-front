import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CreateCard} from '../create.component';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Router} from '@angular/router';

type CreateState = 'idle' | 'loading' | 'result';

@Component({
  selector: 'app-create-detail',
  imports: [
    ButtonComponent,
  ],
  standalone: true,
  templateUrl: './create-detail.html',
  styleUrls: ['./create-detail.scss'],
})
export class CreateDetail {

  @Input() card!: CreateCard;
  @Output() back = new EventEmitter<void>();
  @ViewChild('photoGenerate', { static: false }) photoGenerate!: ElementRef<HTMLInputElement>;

  photos: { generate: string | null } = { generate: null };
  generationHistory: any[] = [];

  constructor(private cdr: ChangeDetectorRef,
              private router: Router) {
  }

  goBack() {
    this.back.emit();
  }

  onPhotoSelected(event: Event, type: 'generate' ) {
    const generate = (event.target as HTMLInputElement)?.files?.[0];
    if (!generate) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[type] = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(generate);
    this.cdr.detectChanges();
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
  }


  navigateToHistory() {
    this.router.navigate(['/history'])
  }


  createState: CreateState = 'idle';

  createImage() {
    this.createState = 'loading';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.createState = 'result';
      this.cdr.detectChanges();
    }, 2000);
  }

}
