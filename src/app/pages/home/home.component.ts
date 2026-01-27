import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaidDialog } from '../../shared/paid-dialog/paid-dialog';
import { ScenesGrid } from '../scenes/scenes-grid/scenes-grid';
import { ScenesCard } from '../scenes/scenes-card/scenes-card';
import { AvatarService } from '../../core/services/avatar.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, PaidDialog, ScenesGrid, ScenesCard],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit{

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  isLoading: boolean = false;
  userAvatars: string[] = [];
  currentAvatar: string = "";

  constructor(
    private avatarService: AvatarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUserAvatars();
  }

  scenes = [
    {
      title: 'Домашний портрет',
      description: 'Мягкий свет, уют, естественность',
      image: 'assets/images/home-portrait.png'
    },
    {
      title: 'Студийный образ',
      description: 'Чистый фон, аккуратный свет',
      image: 'assets/images/studio-image.png'
    },
    {
      title: 'Городской вечер',
      description: 'Уличный свет, глубина, атмосфера',
      image: 'assets/images/city-evening.png'
    },
    {
      title: 'Зимний образ',
      description: 'Холодный свет, текстуры, объём',
      image: 'assets/images/winter-look.png'
    },
    {
      title: 'Профиль / Аватар',
      description: 'Идеально для соцсетей',
      image: 'assets/images/profile-avatar.png'
    },
    {
      title: 'Пара / Duo',
      description: 'Два человека в одном кадре',
      image: 'assets/images/pair-duo.png'
    },
  ];

  selectedScene: { title: string; description: string; image: string } | null = null;

  onSceneSelect(scene: { title: string; description: string; image: string }) {
    this.selectedScene = scene;
  }

  backToGrid() {
    this.selectedScene = null;
  }

  showPaidDialog = signal(true);

  closeDialog() {
    this.showPaidDialog.set(false);

    setTimeout(() => {
      this.showPaidDialog.set(true);
    }, 60_000);
  }

  loadUserAvatars() {
    const userId = this.UUID;
    this.isLoading = true;

    this.avatarService.findByUser(userId).subscribe({
      next: (avatar) => {
        if (avatar && avatar.imagesURL) {
          this.userAvatars = [...avatar.imagesURL];
          this.currentAvatar = this.userAvatars[0];
        } else {
          this.userAvatars = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
